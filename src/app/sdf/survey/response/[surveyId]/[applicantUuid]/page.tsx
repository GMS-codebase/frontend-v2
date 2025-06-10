"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { IoArrowBack } from "react-icons/io5"
import { format } from "date-fns"
import { authorizedApi } from "@/utils/api"
import { notifications } from "@mantine/notifications"
import { Card, CardContent } from "@/components/ui/Card"
import { Clock, User, FileText, Download } from "lucide-react"

interface SurveyResponse {
  uuid: string
  id: number
  answers: string
  status: "SUBMITTED" | "REVIEWED"
  submitted_at: string
  survey: {
    id: number
    name: string
    qns: string
    survey_TYPE: string
    survey_status: string
    created_at: string
    expiry_date: string
  }
  applicant?: {
    uuid: string
    name: string
    email: string
    phone: string
    address: string
    gender: string
  }
  trainee?: {
    uuid: string
    name: string
    email: string
    phone: string
    gender: string
    nationalId: string
    applicationNumber: string
  }
}

interface ParsedAnswer {
  question: string
  answer: string
}

const IndividualResponsePage = () => {
  const { surveyId, applicantUuid } = useParams<{ surveyId: string; applicantUuid: string }>()
  const router = useRouter()

  const [response, setResponse] = useState<SurveyResponse | null>(null)
  const [parsedAnswers, setParsedAnswers] = useState<ParsedAnswer[]>([])
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  // Parse survey questions to create question map
  const parseQuestions = (qns: string): { [key: string]: string } => {
    try {
      const parsed = JSON.parse(qns)
      const questionMap: { [key: string]: string } = {}

      if (Array.isArray(parsed)) {
        // Handle simple array format: [{"question": "How do you rate our service?"}]
        parsed.forEach((item: any, index: number) => {
          if (item.question) {
            questionMap[`q${index + 1}`] = item.question
            questionMap[item.question] = item.question
            // Also map by index for direct access
            questionMap[index.toString()] = item.question
          }
        })
      } else if (typeof parsed === "object") {
        // Handle complex nested format
        Object.values(parsed).forEach((section: any) => {
          if (section && section.pages && Array.isArray(section.pages)) {
            section.pages.forEach((pageContent: any) => {
              if (pageContent && pageContent.surveys && Array.isArray(pageContent.surveys)) {
                pageContent.surveys.forEach((question: any) => {
                  if (question.id && question.title) {
                    questionMap[question.id] = question.title
                    questionMap[question.title] = question.title
                  }
                })
              }
            })
          }
        })
      }

      return questionMap
    } catch (error) {
      console.warn("Failed to parse survey questions:", error)
      return {}
    }
  }

  // Enhanced parse answers function to handle all possible formats
  const parseAnswers = (answers: string, questionMap: { [key: string]: string }): ParsedAnswer[] => {
    try {
      // First, try to parse the outer JSON
      const parsed = JSON.parse(answers)
      const results: ParsedAnswer[] = []

      if (typeof parsed === "object" && parsed !== null) {
        // Handle different answer formats
        Object.entries(parsed).forEach(([key, value]) => {
          // Format 1: Simple key-value pairs like {"q1": "Yes", "q2": "No"}
          if (!key.includes("{") && !key.includes('"question"')) {
            results.push({
              question: questionMap[key] || key,
              answer: String(value),
            })
            return
          }

          // Format 2: JSON string as key like {"{\"question\":\"...\",\"answer\":\"...\"}": ""}
          if (key.includes("{") && key.includes('"question"')) {
            try {
              // Clean up the key by removing extra quotes and escaping
              let cleanKey = key
              if (key.startsWith('"{') && key.endsWith('}"')) {
                cleanKey = key.slice(1, -1) // Remove outer quotes
              }

              // Parse the inner JSON
              const innerJson = JSON.parse(cleanKey)

              if (innerJson.question && innerJson.answer) {
                results.push({
                  question: innerJson.question,
                  answer: innerJson.answer,
                })
              } else if (innerJson.question) {
                results.push({
                  question: innerJson.question,
                  answer: String(value) || "No answer provided",
                })
              }
            } catch (innerError) {
              // Try to extract using regex if JSON parsing fails
              const questionMatch = key.match(/"question":\s*"([^"]*)"/)
              const answerMatch = key.match(/"answer":\s*"([^"]*)"/)

              if (questionMatch) {
                results.push({
                  question: questionMatch[1],
                  answer: answerMatch ? answerMatch[1] : String(value) || "No answer provided",
                })
              } else {
                // Last resort - show as formatted text
                results.push({
                  question: "Survey Question",
                  answer: String(value) || "No answer provided",
                })
              }
            }
            return
          }

          // Format 3: Regular key-value pairs
          results.push({
            question: questionMap[key] || key,
            answer: String(value),
          })
        })
      }

      // Format 4: Direct array of question-answer objects
      if (Array.isArray(parsed)) {
        parsed.forEach((item, index) => {
          if (typeof item === "object" && item !== null) {
            results.push({
              question: item.question || questionMap[index.toString()] || `Question ${index + 1}`,
              answer: item.answer || "No answer provided",
            })
          } else {
            results.push({
              question: questionMap[index.toString()] || `Question ${index + 1}`,
              answer: String(item),
            })
          }
        })
      }

      // If no results found, try comprehensive regex pattern matching
      if (results.length === 0) {
        // Try different regex patterns to extract question-answer pairs
        const patterns = [
          /"question":\s*"([^"]*)"\s*,\s*"answer":\s*"([^"]*)"/g,
          /"question":"([^"]*)","answer":"([^"]*)"/g,
          /question:\s*"([^"]*)"\s*,\s*answer:\s*"([^"]*)"/g,
        ]

        for (const pattern of patterns) {
          const matches = [...answers.matchAll(pattern)]
          if (matches.length > 0) {
            return matches.map((match) => ({
              question: match[1],
              answer: match[2],
            }))
          }
        }

        // Try to extract from the raw string using a more flexible approach
        if (answers.includes('"question"') && answers.includes('"answer"')) {
          // Split by common delimiters and try to find question-answer pairs
          const questionRegex = /"question":\s*"([^"]*)"/g
          const answerRegex = /"answer":\s*"([^"]*)"/g

          const questions = [...answers.matchAll(questionRegex)]
          const answersMatches = [...answers.matchAll(answerRegex)]

          if (questions.length > 0 && answersMatches.length > 0) {
            const minLength = Math.min(questions.length, answersMatches.length)
            for (let i = 0; i < minLength; i++) {
              results.push({
                question: questions[i][1],
                answer: answersMatches[i][1],
              })
            }
          }
        }

        if (results.length > 0) {
          return results
        }

        // Final fallback - show formatted raw data
        return [
          {
            question: "Survey Response",
            answer: JSON.stringify(parsed, null, 2),
          },
        ]
      }

      return results
    } catch (error) {
      // Last resort: comprehensive regex extraction
      const patterns = [
        /"question":\s*"([^"]*)"\s*,\s*"answer":\s*"([^"]*)"/g,
        /"question":"([^"]*)","answer":"([^"]*)"/g,
        /question:\s*"([^"]*)"\s*,\s*answer:\s*"([^"]*)"/g,
      ]

      for (const pattern of patterns) {
        const matches = [...answers.matchAll(pattern)]
        if (matches.length > 0) {
          return matches.map((match) => ({
            question: match[1],
            answer: match[2],
          }))
        }
      }

      // If all parsing fails, return the raw data in a readable format
      return [
        {
          question: "Raw Survey Response",
          answer: answers,
        },
      ]
    }
  }

  // Fetch individual response
  const fetchResponse = async () => {
    try {
      setLoading(true)
      // Use the correct API endpoint
      const apiResponse = await authorizedApi.get(`/survey/survey-response/${surveyId}/${applicantUuid}`)

      const responseData = apiResponse.data
      setResponse(responseData)

      // Parse the answers
      if (responseData.answers) {
        let questionMap: { [key: string]: string } = {}

        // Parse questions if available
        if (responseData.survey?.qns) {
          questionMap = parseQuestions(responseData.survey.qns)
        }

        const parsed = parseAnswers(responseData.answers, questionMap)
        setParsedAnswers(parsed)
      } else {
        setParsedAnswers([])
      }

      notifications.show({
        message: "Response loaded successfully",
        color: "green",
      })
    } catch (error) {
      console.error("Error fetching response:", error)
      notifications.show({
        message: "Failed to load response",
        color: "red",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle status change
  const handleStatusChange = async (newStatus: "SUBMITTED" | "REVIEWED") => {
    if (!response) return

    try {
      setIsUpdating(true)

      // Update status via API
      await authorizedApi.put(`/survey/survey-response/${surveyId}/${applicantUuid}/status`, {
        status: newStatus,
      })

      // Update local state
      setResponse((prev) => (prev ? { ...prev, status: newStatus } : null))

      notifications.show({
        message: `Response marked as ${newStatus.toLowerCase()}`,
        color: "green",
      })
    } catch (error) {
      console.error("Error updating response status:", error)
      notifications.show({
        message: "Failed to update response status",
        color: "red",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Export response as formatted text
  const handleExportResponse = () => {
    if (!response || !parsedAnswers.length) return

    const respondent = response.applicant || response.trainee
    const respondentType = response.applicant ? "Applicant" : "Trainee"

    let exportText = `Survey Response Export\n`
    exportText += `========================\n\n`
    exportText += `Survey: ${response.survey.name}\n`
    exportText += `Survey Type: ${response.survey.survey_TYPE}\n`
    exportText += `Respondent: ${respondent?.name || "N/A"} (${respondentType})\n`
    exportText += `Email: ${respondent?.email || "N/A"}\n`
    exportText += `Submitted: ${format(new Date(response.submitted_at), "MMM dd, yyyy HH:mm")}\n`
    exportText += `Status: ${response.status}\n\n`
    exportText += `Responses:\n`
    exportText += `----------\n\n`

    parsedAnswers.forEach((answer, index) => {
      exportText += `${index + 1}. ${answer.question}\n`
      exportText += `   Answer: ${answer.answer}\n\n`
    })

    // Create and download file
    const blob = new Blob([exportText], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `survey-response-${response.survey.name}-${respondent?.name || "unknown"}-${format(new Date(), "yyyy-MM-dd")}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    notifications.show({
      message: "Response exported successfully",
      color: "green",
    })
  }

  useEffect(() => {
    if (surveyId && applicantUuid) {
      fetchResponse()
    }
  }, [surveyId, applicantUuid])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-gray-600">Loading response...</span>
        </div>
      </div>
    )
  }

  if (!response) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Response not found</h3>
          <p className="text-gray-600 mb-4">The requested survey response could not be found.</p>
          <button onClick={() => router.back()} className="text-blue-600 hover:text-blue-800 font-medium">
            Go back
          </button>
        </div>
      </div>
    )
  }

  const respondent = response.applicant || response.trainee
  const respondentType = response.applicant ? "Applicant" : "Trainee"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <IoArrowBack size={18} />
              Back to Responses
            </button>

            <div className="flex items-center space-x-3">
              {parsedAnswers.length > 0 && (
                <button
                  onClick={handleExportResponse}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Response
                </button>
              )}
              <button
                onClick={() => handleStatusChange("SUBMITTED")}
                disabled={isUpdating || response.status === "SUBMITTED"}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  response.status === "SUBMITTED"
                    ? "bg-amber-100 text-amber-800 cursor-not-allowed"
                    : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isUpdating ? "Updating..." : "Mark as Pending"}
              </button>
              <button
                onClick={() => handleStatusChange("REVIEWED")}
                disabled={isUpdating || response.status === "REVIEWED"}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  response.status === "REVIEWED"
                    ? "bg-green-100 text-green-800 cursor-not-allowed"
                    : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isUpdating ? "Updating..." : "Mark as Reviewed"}
              </button>
            </div>
          </div>

          {/* Response Overview */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Survey Response Details</h1>
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    response.status === "REVIEWED" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {response.status === "REVIEWED" ? "Reviewed" : "Pending Review"}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Respondent Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Respondent Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium text-gray-900">{respondent?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900">{respondent?.email || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium text-gray-900">{respondent?.phone || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-sm text-sm font-medium">
                        {respondentType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium text-gray-900">{respondent?.gender || "N/A"}</span>
                    </div>
                    {response.trainee && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">National ID:</span>
                          <span className="font-medium text-gray-900">{response.trainee.nationalId || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Application Number:</span>
                          <span className="font-medium text-gray-900">
                            {response.trainee.applicationNumber || "N/A"}
                          </span>
                        </div>
                      </>
                    )}
                    {response.applicant && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium text-gray-900 text-right max-w-xs">
                          {response.applicant.address || "N/A"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Survey Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Survey Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Survey Name:</span>
                      <span className="font-medium text-gray-900">{response.survey.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Survey Type:</span>
                      <span className="font-medium text-gray-900">{response.survey.survey_TYPE}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Survey Status:</span>
                      <span className="font-medium text-gray-900">{response.survey.survey_status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium text-gray-900">
                        {format(new Date(response.survey.created_at), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expires:</span>
                      <span className="font-medium text-gray-900">
                        {format(new Date(response.survey.expiry_date), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Submitted:</span>
                      <span className="font-medium text-gray-900 flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {format(new Date(response.submitted_at), "MMM dd, yyyy HH:mm")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Survey Responses */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Survey Responses</h2>
                {parsedAnswers.length > 0 && (
                  <span className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
                    {parsedAnswers.length} response{parsedAnswers.length !== 1 ? "s" : ""} found
                  </span>
                )}
              </div>

              {parsedAnswers.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No responses found</h3>
                  <p className="text-gray-600">This survey response does not contain any parseable answers.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {parsedAnswers.map((answer, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mb-2">
                              Question {index + 1}
                            </span>
                            <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">{answer.question}</h3>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white px-6 py-5">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500 mb-1">Answer:</p>
                            <div className="prose max-w-none">
                              <p className="text-gray-900 leading-relaxed whitespace-pre-wrap text-base">
                                {answer.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default IndividualResponsePage
