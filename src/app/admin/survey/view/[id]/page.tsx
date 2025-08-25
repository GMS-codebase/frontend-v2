"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Download,
  Eye,
  MoreHorizontal,
  User,
  Clock,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCheck,
  BarChart3,
  PieChart,
} from "lucide-react";
import { format } from "date-fns";
import { notifications } from "@mantine/notifications";
import { authorizedApi } from "@/utils/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Menu } from "@mantine/core";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { Select, SelectItem } from "@/components/ui/Select";
import { IoArrowBack } from "react-icons/io5";
import { DataTable } from "@/components/core/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { HiDotsHorizontal } from "react-icons/hi";
import Link from "next/link";
import { VscEye } from "react-icons/vsc";
import * as XLSX from "xlsx";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartOptions,
  ChartData,
} from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

// Types
interface Survey {
  id: number;
  name: string;
  qns: string;
  expiry_date: string;
  survey_status: string;
  created_at: string;
  updated_at: string;
  survey_TYPE: string;
  hasSurvey_Started: boolean;
  surveyStartingTime: string;
}

interface Applicant {
  uuid: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  gender?: string;
  nationalId?: string;
  user_id?: string;
  age?: number;
  description?: string;
  po_box?: string;
  has_completed_profile?: boolean;
  contact_count?: number;
}

interface Trainee {
  uuid: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  gender?: string;
  nationalId?: string;
  applicationNumber?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  approvalStatus?: string;
  user_id?: string;
}

interface SurveyResponse {
  uuid: string;
  user_id?: string;
  id?: number;
  traineeUuid?: string | null;
  answers?: string;
  status?: "SUBMITTED" | "REVIEWED";
  submitted_at?: string;
  survey?: Survey;
  applicant?: Applicant | null;
  trainee?: Trainee | null;
  deletedStatus?: boolean;
  doneAt?: string;
  lastUpdatedAt?: string;
  parsedAnswers?: ParsedAnswer[];
}

interface ParsedAnswer {
  question: string;
  answer: string;
}

interface QuestionAnalytics {
  question: string;
  questionId: string;
  surveyType: string;
  sectionTitle?: string;
  sectionDescription?: string;
  totalResponses: number;
  totalSubmissions: number;
  answerDistribution: {
    answer: string;
    count: number;
    percentage: number;
  }[];
}

interface AnalyticsFilters {
  window: string;
  subwindow: string;
  sector: string;
  trade: string;
  gender: string;
  age: string;
  province: string;
  district: string;
  cell: string;
  village: string;
  fromDate: string;
  toDate: string;
}

// Parse survey questions
const parseQuestions = (qns: string): { [key: string]: string } => {
  if (!qns) return {};
  try {
    let cleanedQns = qns.trim();
    if (cleanedQns.startsWith('("') && cleanedQns.endsWith('")')) {
      cleanedQns = cleanedQns.substring(2, cleanedQns.length - 2);
    }
    if (cleanedQns.startsWith('"') && cleanedQns.endsWith('"')) {
      cleanedQns = cleanedQns.substring(1, cleanedQns.length - 1);
    }
    cleanedQns = cleanedQns.replace(/\\"/g, '"');
    cleanedQns = cleanedQns.replace(/([{,])\s*([a-zA-Z0-9_\-]+):/g, '$1"$2":');

    const parsed = JSON.parse(cleanedQns);
    const questionMap: { [key: string]: string } = {};

    if (Array.isArray(parsed)) {
      parsed.forEach((item: any, index: number) => {
        if (item.question) {
          questionMap[`q${index + 1}`] = item.question;
          questionMap[item.question] = item.question;
          questionMap[index.toString()] = item.question;
        }
      });
    } else if (typeof parsed === "object") {
      Object.values(parsed).forEach((section: any) => {
        if (section && section.pages && Array.isArray(section.pages)) {
          section.pages.forEach((pageContent: any) => {
            if (
              pageContent &&
              pageContent.surveys &&
              Array.isArray(pageContent.surveys)
            ) {
              pageContent.surveys.forEach((question: any) => {
                if (question.id && question.title) {
                  questionMap[question.id] = question.title;
                  questionMap[question.title] = question.title;
                }
              });
            }
          });
        }
      });
    }
    return questionMap;
  } catch (error) {
    console.warn(
      "Failed to parse survey questions:",
      error,
      "Problematic qns:",
      qns
    );
    notifications.show({
      message: "Failed to parse survey questions data.",
      color: "red",
    });
    return {};
  }
};

// Parse answers
const parseAnswers = (
  answers: string,
  questionMap: { [key: string]: string }
): ParsedAnswer[] => {
  try {
    let cleanedAnswers = answers;
    if (cleanedAnswers.startsWith('("') && cleanedAnswers.endsWith('")')) {
      cleanedAnswers = cleanedAnswers.substring(2, cleanedAnswers.length - 2);
    }
    cleanedAnswers = cleanedAnswers.replace(/\\"/g, '"');
    cleanedAnswers = cleanedAnswers.replace(
      /([{,])\s*([a-zA-Z0-9_\-]+):/g,
      '$1"$2":'
    );

    const parsed = JSON.parse(cleanedAnswers);
    const results: ParsedAnswer[] = [];

    if (typeof parsed === "object" && parsed !== null) {
      Object.entries(parsed).forEach(([key, value]) => {
        if (!key.includes("{") && !key.includes('"question"')) {
          results.push({
            question: questionMap[key] || key,
            answer: String(value),
          });
          return;
        }
        if (key.includes("{") && key.includes('"question"')) {
          try {
            let cleanKey = key;
            if (cleanKey.startsWith('"{') && cleanKey.endsWith('}"'))
              cleanKey = cleanKey.slice(1, -1);
            const innerJson = JSON.parse(cleanKey);
            if (innerJson.question && innerJson.answer) {
              results.push({
                question: innerJson.question,
                answer: innerJson.answer,
              });
            } else if (innerJson.question) {
              results.push({
                question: innerJson.question,
                answer: String(value) || "No answer provided",
              });
            }
          } catch (innerError) {
            const questionMatch = key.match(/"question":\s*"([^"]*)"/);
            const answerMatch = key.match(/"answer":\s*"([^"]*)"/);
            if (questionMatch) {
              results.push({
                question: questionMatch[1],
                answer: answerMatch
                  ? answerMatch[1]
                  : String(value) || "No answer provided",
              });
            } else {
              results.push({
                question: "Survey Question",
                answer: String(value) || "No answer provided",
              });
            }
          }
          return;
        }
        results.push({
          question: questionMap[key] || key,
          answer: String(value),
        });
      });
    }

    if (Array.isArray(parsed)) {
      parsed.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          results.push({
            question:
              item.question ||
              questionMap[index.toString()] ||
              `Question ${index + 1}`,
            answer: item.answer || "No answer provided",
          });
        } else {
          results.push({
            question: questionMap[index.toString()] || `Question ${index + 1}`,
            answer: String(item),
          });
        }
      });
    }

    if (results.length === 0) {
      const patterns = [/("question":\s*"[^"]*"\s*,\s*"answer":\s*"[^"]*")/g];
      for (const pattern of patterns) {
        const matches = [...answers.matchAll(pattern)];
        if (matches.length > 0) {
          return matches.map((match) => {
            const [fullMatch] = match;
            const questionMatch = fullMatch.match(/"question":\s*"([^"]*)"/);
            const answerMatch = fullMatch.match(/"answer":\s*"([^"]*)"/);
            return {
              question: questionMatch ? questionMatch[1] : "Unknown Question",
              answer: answerMatch ? answerMatch[1] : "No answer",
            };
          });
        }
      }
      return [{ question: "Raw Survey Response", answer: answers }];
    }

    return results;
  } catch (error) {
    return [{ question: "Raw Survey Response", answer: answers }];
  }
};

const SurveyViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [surveyTypeFilter, setSurveyTypeFilter] = useState<string>("all");
  const [dateFromFilter, setDateFromFilter] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string>("");

  // Analytics state
  const [activeTab, setActiveTab] = useState<"responses" | "analytics">("responses");
  const [questionAnalytics, setQuestionAnalytics] = useState<QuestionAnalytics[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsFilters, setAnalyticsFilters] = useState<AnalyticsFilters>({
    window: "",
    subwindow: "",
    sector: "",
    trade: "",
    gender: "",
    age: "",
    province: "",
    district: "",
    cell: "",
    village: "",
    fromDate: "",
    toDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResponses, setTotalResponses] = useState(0);
  const [pageSize] = useState(10);

  const fetchSurvey = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authorizedApi.get(`/survey/single-survey/${id}`);
      setSurvey(response.data);
    } catch (err: any) {
      console.error("Error fetching survey:", err);
      setError(err.response?.data?.message || "Failed to load survey data");
      notifications.show({
        message: err.response?.data?.message || "Failed to load survey data",
        color: "red",
      });
      setSurvey(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchResponses = useCallback(
    async (page = 1) => {
      try {
        setLoading(page === 1);
        const response = await authorizedApi.get(
          `/survey/getSurveyResponses/${id}`
        );

        let responsesData = [];
        if (Array.isArray(response.data)) {
          responsesData = response.data;
        } else {
          console.error(
            "API returned unexpected data structure:",
            response.data
          );
          notifications.show({
            title: "Error",
            message: "Received unexpected data format for responses.",
            color: "red",
          });
          setResponses([]);
          setTotalResponses(0);
          setTotalPages(1);
          setCurrentPage(1);
          setLoading(false);
          return;
        }

        // Fetch applicant and trainee names
        const enrichedResponses = await Promise.all(
          responsesData.map(async (item) => {
            let enrichedItem = { ...item };

            // Fetch applicant name if available
            if (item.applicant && item.applicant.uuid && !item.applicant.name) {
              try {
                const applicantResponse = await authorizedApi.get(
                  `/applicant/${item.applicant.uuid}/by-id`
                );
                enrichedItem = {
                  ...enrichedItem,
                  applicant: {
                    ...item.applicant,
                    name: applicantResponse.data.name || "N/A",
                  },
                };
              } catch (err) {
                console.warn(
                  `Failed to fetch applicant name for uuid ${item.applicant.uuid}:`,
                  err
                );
              }
            }

            const questionMap = parseQuestions(item.survey?.qns ?? "");
            const parsedAnswers = parseAnswers(item.answers ?? "", questionMap);

            return {
              ...enrichedItem,
              parsedAnswers,
            };
          })
        );

        const startIndex = (page - 1) * pageSize;
        const paginatedResponses = enrichedResponses.slice(
          startIndex,
          startIndex + pageSize
        );
        const total = enrichedResponses.length;
        const totalPagesCalc = Math.ceil(total / pageSize);

        setResponses(enrichedResponses); // Store all responses for analytics
        setTotalResponses(total);
        setTotalPages(totalPagesCalc);
        setCurrentPage(page);
      } catch (err: any) {
        console.error("Error fetching responses:", err);
        notifications.show({
          message:
            err.response?.data?.message || "Failed to load survey responses",
          color: "red",
        });
        setResponses([]);
        setTotalResponses(0);
        setTotalPages(1);
        setCurrentPage(1);
      } finally {
        setLoading(false);
      }
    },
    [id, pageSize]
  );

  // Process analytics data
  const processAnalytics = useCallback(() => {
    if (!responses.length || !survey) return;

    setAnalyticsLoading(true);
    try {
      const questionMap = parseQuestions(survey.qns);
      const analytics: QuestionAnalytics[] = [];

      // Parse the survey questions to identify question types
      let surveyQuestions: any[] = [];
      try {
        let cleanedQns = survey.qns.trim();
        if (cleanedQns.startsWith('("') && cleanedQns.endsWith('")')) {
          cleanedQns = cleanedQns.substring(2, cleanedQns.length - 2);
        }
        if (cleanedQns.startsWith('"') && cleanedQns.endsWith('"')) {
          cleanedQns = cleanedQns.substring(1, cleanedQns.length - 1);
        }
        cleanedQns = cleanedQns.replace(/\\"/g, '"');
        cleanedQns = cleanedQns.replace(/([{,])\s*([a-zA-Z0-9_\-]+):/g, '$1"$2":');

        const parsed = JSON.parse(cleanedQns);
        
        if (Array.isArray(parsed)) {
          surveyQuestions = parsed;
        } else if (typeof parsed === "object") {
          Object.values(parsed).forEach((section: any) => {
            if (section && section.pages && Array.isArray(section.pages)) {
              section.pages.forEach((pageContent: any) => {
                if (pageContent && pageContent.surveys && Array.isArray(pageContent.surveys)) {
                  surveyQuestions.push(...pageContent.surveys);
                }
              });
            }
          });
        }
      } catch (error) {
        console.warn("Failed to parse survey structure for analytics:", error);
      }

      // Group questions by QuestionType/Survey Type with title and description
      // First, let's get all unique questions from all responses
      const allQuestions = new Set<string>();
      responses.forEach(response => {
        if (response.parsedAnswers) {
          response.parsedAnswers.forEach(answer => {
            allQuestions.add(answer.question);
          });
        }
      });

      console.log("All questions found:", Array.from(allQuestions));
      console.log("Survey questions structure:", surveyQuestions);

      // Create a map to store analytics grouped by question type
      const analyticsByType: { [key: string]: QuestionAnalytics[] } = {};

      // Process each question - only for radio choices and checkbox choices
      allQuestions.forEach(question => {
        // Find the question in survey structure to check its type
        const surveyQuestion = surveyQuestions.find(q => 
          q.title === question || q.question === question || q.id === question
        );
        
        console.log(`Processing question: "${question}"`, {
          surveyQuestion,
          questionType: surveyQuestion?.type,
          questionId: surveyQuestion?.id,
          questionTitle: surveyQuestion?.title
        });
        
        // Check if this is a choice-based question
        let isChoiceQuestion = false;
        
        if (surveyQuestion && surveyQuestion.type) {
          const questionType = surveyQuestion.type.toLowerCase();
          isChoiceQuestion = questionType.includes('radio') || 
                            questionType.includes('checkbox') || 
                            questionType.includes('choice') ||
                            questionType.includes('select') ||
                            questionType.includes('dropdown');
        } else {
          // Fallback: if we can't determine question type, check if the question has multiple choice answers
          // This helps when the survey structure doesn't clearly indicate question types
          const questionResponses = responses.filter(response => 
            response.parsedAnswers?.some(a => a.question === question)
          );
          
          // Check if this question has multiple different answers (indicating it's a choice question)
          const uniqueAnswers = new Set<string>();
          questionResponses.forEach(response => {
            const answer = response.parsedAnswers?.find(a => a.question === question);
            if (answer && answer.answer) {
              const cleanAnswer = answer.answer.trim();
              if (cleanAnswer && cleanAnswer !== 'undefined' && cleanAnswer !== 'null') {
                uniqueAnswers.add(cleanAnswer);
              }
            }
          });
          
          console.log(`Question "${question}" has ${uniqueAnswers.size} unique answers:`, Array.from(uniqueAnswers));
          
          // If there are multiple different answers, it's likely a choice question
          isChoiceQuestion = uniqueAnswers.size > 1;
        }
        
        // Debug logging for question type detection
        console.log(`Question: "${question}" - isChoiceQuestion: ${isChoiceQuestion}`, {
          surveyQuestion,
          questionType: surveyQuestion?.type
        });
        
        // Only process choice-based questions
        if (isChoiceQuestion) {
          
          const questionResponses = responses.filter(response => 
            response.parsedAnswers?.some(a => a.question === question)
          );

          // Apply analytics filters
          const filteredResponses = questionResponses.filter(response => {
            const applicant = response.applicant;
            const trainee = response.trainee;
            
            // Filter by gender
            if (analyticsFilters.gender && 
                applicant?.gender !== analyticsFilters.gender && 
                trainee?.gender !== analyticsFilters.gender) {
              return false;
            }

            // Filter by age
            if (analyticsFilters.age && applicant?.age) {
              const age = applicant.age;
              const [minAge, maxAge] = analyticsFilters.age.split('-').map(Number);
              if (age < minAge || age > maxAge) return false;
            }

            // Filter by date range
            if (analyticsFilters.fromDate && response.submitted_at) {
              if (new Date(response.submitted_at) < new Date(analyticsFilters.fromDate)) {
                return false;
              }
            }
            if (analyticsFilters.toDate && response.submitted_at) {
              if (new Date(response.submitted_at) > new Date(analyticsFilters.toDate)) {
                return false;
              }
            }

            return true;
          });

          // Calculate answer distribution
          const answerCounts: { [key: string]: number } = {};
          let totalAnswers = 0;

          filteredResponses.forEach(response => {
            const answer = response.parsedAnswers?.find(a => a.question === question);
            if (answer && answer.answer) {
              const cleanAnswer = answer.answer.trim();
              if (cleanAnswer) {
                answerCounts[cleanAnswer] = (answerCounts[cleanAnswer] || 0) + 1;
                totalAnswers++;
              }
            }
          });

          console.log(`Question "${question}" answer counts:`, answerCounts, `Total: ${totalAnswers}`);

          // Only add analytics if we have meaningful data
          if (totalAnswers > 0 && Object.keys(answerCounts).length > 0) {
            const answerDistribution = Object.entries(answerCounts).map(([answer, count]) => ({
              answer: answer || "No answer",
              count,
              percentage: totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0
            }));

            // Determine question type and section information
            let questionType = "General Questions";
            let sectionTitle = "General Questions";
            let sectionDescription = "Questions from the general survey section";
            
            if (surveyQuestion) {
              // Try to find the section this question belongs to
              try {
                if (survey.qns) {
                  let cleanedQns = survey.qns.trim();
                  if (cleanedQns.startsWith('("') && cleanedQns.endsWith('")')) {
                    cleanedQns = cleanedQns.substring(2, cleanedQns.length - 2);
                  }
                  if (cleanedQns.startsWith('"') && cleanedQns.endsWith('"')) {
                    cleanedQns = cleanedQns.substring(1, cleanedQns.length - 1);
                  }
                  cleanedQns = cleanedQns.replace(/\\"/g, '"');
                  cleanedQns = cleanedQns.replace(/([{,])\s*([a-zA-Z0-9_\-]+):/g, '$1"$2":');

                  const parsed = JSON.parse(cleanedQns);
                  
                  if (typeof parsed === "object") {
                    Object.entries(parsed).forEach(([sectionKey, section]: [string, any]) => {
                      if (section && section.pages && Array.isArray(section.pages)) {
                        section.pages.forEach((pageContent: any) => {
                          if (pageContent && pageContent.surveys && Array.isArray(pageContent.surveys)) {
                            const foundQuestion = pageContent.surveys.find((q: any) => 
                              q.title === question || q.question === question || q.id === question
                            );
                            if (foundQuestion) {
                              questionType = sectionKey || "General Questions";
                              sectionTitle = section.title || sectionKey || "General Questions";
                              sectionDescription = section.description || `Questions from the ${sectionKey} section`;
                            }
                          }
                        });
                      }
                    });
                  }
                }
              } catch (error) {
                console.warn("Failed to determine section for question:", question, error);
              }
            }

            // Create analytics object with question name instead of ID
            const analyticsItem: QuestionAnalytics = {
              question: surveyQuestion?.title || surveyQuestion?.question || question, // Use question name/title instead of ID
              questionId: surveyQuestion?.id || question,
              surveyType: questionType,
              sectionTitle: sectionTitle,
              sectionDescription: sectionDescription,
              totalResponses: totalAnswers,
              totalSubmissions: filteredResponses.length,
              answerDistribution: answerDistribution.sort((a, b) => b.count - a.count)
            };

            // Group by question type
            if (!analyticsByType[questionType]) {
              analyticsByType[questionType] = [];
            }
            analyticsByType[questionType].push(analyticsItem);
          }
        }
      });

      // Convert grouped analytics to flat array for backward compatibility
      Object.values(analyticsByType).forEach(typeAnalytics => {
        analytics.push(...typeAnalytics);
      });

      console.log("Processed analytics:", analytics);
      console.log("Survey questions structure:", surveyQuestions);
      console.log("Total responses processed:", responses.length);
      console.log("Questions that were processed:", Array.from(allQuestions));
      console.log("Questions that were identified as choice questions:", analytics.map(a => a.question));
      setQuestionAnalytics(analytics);
    } catch (error) {
      console.error("Error processing analytics:", error);
      notifications.show({
        title: "Error",
        message: "Failed to process analytics data",
        color: "red",
      });
    } finally {
      setAnalyticsLoading(false);
    }
  }, [responses, survey, analyticsFilters]);

  // Update analytics when filters change
  useEffect(() => {
    if (activeTab === "analytics" && responses.length > 0) {
      processAnalytics();
    }
  }, [activeTab, responses, analyticsFilters, processAnalytics]);

  useEffect(() => {
    if (id) {
      fetchSurvey();
      fetchResponses(1);
    }
  }, [id, fetchSurvey, fetchResponses]);


  console.log(responses)

  const filteredResponses = responses.filter((response) => {
    if (statusFilter === "reviewed" && response.status !== "REVIEWED")
      return false;
    if (statusFilter === "pending" && response.status !== "SUBMITTED")
      return false;
    if (
      surveyTypeFilter !== "all" &&
      response.survey?.survey_TYPE !== surveyTypeFilter
    )
      return false;
    const submittedDate = response.submitted_at
      ? new Date(response.submitted_at)
      : new Date();
    if (dateFromFilter && submittedDate < new Date(dateFromFilter))
      return false;
    if (dateToFilter && submittedDate > new Date(dateToFilter)) return false;
    const searchLower = searchQuery.toLowerCase();
    const applicantName = response.applicant?.name?.toLowerCase() || "";
    const traineeName = (response.trainee?.firstname || "") + " " + (response.trainee?.lastname || "") || "";
    const email =
      response.applicant?.email?.toLowerCase() ||
      response.trainee?.email?.toLowerCase() ||
      "";
    return (
      applicantName.includes(searchLower) ||
      traineeName.toLowerCase().includes(searchLower) ||
      email.includes(searchLower)
    );
  });

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchResponses(page);
    }
  };

  const handleExportToExcel = useCallback(() => {
    try {
      // Create Excel workbook
      const workbook = XLSX.utils.book_new();
      
      // Prepare data for export
      const exportData = filteredResponses.map((response) => {
          const respondent =
            response.applicant?.name || (response.trainee?.firstname || "") + " " + (response.trainee?.lastname || "") || "N/A";
          const respondentType = response.applicant
            ? "Applicant"
            : response.trainee
              ? "Trainee"
              : "N/A";
          const email =
            response.applicant?.email || response.trainee?.email || "N/A";
          const submitted = response.submitted_at
            ? format(new Date(response.submitted_at), "yyyy-MM-dd HH:mm")
            : "N/A";
          const status = response.status || "N/A";
          let answersText = "No answers";
          try {
            const questionMap = parseQuestions(response.survey?.qns ?? "");
            const parsedAnswers = parseAnswers(
              response.answers ?? "",
              questionMap
            );
            answersText = parsedAnswers
              .map((r) => `${r.question}: ${r.answer}`)
              .join("; ");
          } catch (error) {
            console.warn("Failed to parse answers for export:", error);
          }
        
        return {
          Respondent: respondent,
          Type: respondentType,
          Email: email,
          Submitted: submitted,
          Status: status,
          Responses: answersText,
        };
      });

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths for better readability
      worksheet["!cols"] = [
        { wch: 25 }, // Respondent
        { wch: 12 }, // Type
        { wch: 30 }, // Email
        { wch: 20 }, // Submitted
        { wch: 12 }, // Status
        { wch: 60 }, // Responses
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Survey Responses");

      // Generate filename
      const filename = `survey-${survey?.name || id}-responses-${format(new Date(), "yyyy-MM-dd")}.xlsx`;

      // Save the Excel file
      XLSX.writeFile(workbook, filename);

      notifications.show({
        message: "Excel file exported successfully",
        color: "green",
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      notifications.show({
        message: "Failed to export Excel file",
        color: "red",
      });
    }
  }, [filteredResponses, survey, id]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSurveyTypeFilter("all");
    setDateFromFilter("");
    setDateToFilter("");
  };

  const clearAnalyticsFilters = () => {
    setAnalyticsFilters({
      window: "",
      subwindow: "",
      sector: "",
      trade: "",
      gender: "",
      age: "",
      province: "",
      district: "",
      cell: "",
      village: "",
      fromDate: "",
      toDate: "",
    });
  };

  const handleAnalyticsFilterChange = (key: keyof AnalyticsFilters, value: string) => {
    setAnalyticsFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Chart options for donut charts
  const chartOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%'
  };

  // Render question analytics
  const renderQuestionAnalytics = (analytics: QuestionAnalytics) => {
    const colors = [
      '#3B82F6', // Blue
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#06B6D4', // Cyan
      '#F97316', // Orange
      '#84CC16', // Lime
    ];

    const chartData: ChartData<"doughnut"> = {
      labels: analytics.answerDistribution.map(item => item.answer),
      datasets: [{
        data: analytics.answerDistribution.map(item => item.count),
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 4
      }]
    };

    return (
      <div key={analytics.questionId} className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {analytics.question}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Total Responses: {analytics.totalResponses}</span>
              <span>Total Submissions: {analytics.totalSubmissions}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {analytics.totalResponses}/{analytics.totalSubmissions}
            </div>
            <div className="text-sm text-gray-500">Answers/Submissions</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="h-80">
            <Doughnut data={chartData} options={chartOptions} />
          </div>

          {/* Legend */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 mb-3">Answer Distribution</h4>
            {analytics.answerDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="text-sm font-medium text-gray-700">{item.answer}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{item.count}</div>
                  <div className="text-xs text-gray-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };


  const columns: ColumnDef<SurveyResponse>[] = [
    {
      accessorKey: "respondent",
      header: "Respondent",
      cell: ({ row }) => {
        const respondent = row.original.applicant || row.original.trainee;
        const respondentType = row.original.applicant
          ? "Applicant"
          : row.original.trainee
            ? "Trainee"
            : "N/A";

        return (
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              {/* @ts-ignore */}
              <p className="font-medium text-gray-900">{respondent?.name || respondent?.firstname + respondent?.lastname || "N/A"}</p>
              <p className="text-sm text-gray-500">{respondent?.email || "N/A"}</p>
              <p className="text-xs text-blue-600">{respondentType}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "submitted_at",
      header: "Submitted",
      cell: ({ row }) => {
        const submittedAt = row.original.submitted_at;
        return (
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {submittedAt ? format(new Date(submittedAt), "MMM dd, yyyy") : "N/A"}
              </p>
              <p className="text-xs text-gray-500">
                {submittedAt ? format(new Date(submittedAt), "HH:mm") : "N/A"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={status === "REVIEWED" ? "success" : "warning"}>
            {status === "REVIEWED" ? "Reviewed" : "Pending"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const respondentId =
          row.original.applicant?.uuid || row.original.trainee?.uuid || "unknown";
          const isTrainee = row.original.trainee?.uuid ? true : false;

        return (
          <div>
            <Menu shadow="lg" width={200}>
              <Menu.Target>
                <button
                  style={{
                    background:
                      "linear-gradient(84.73deg, #005DE9 10.01%, #0546A8 114.53%)",
                  }}
                  className="p-3 rounded-full border text-white hover:bg-red-100"
                >
                  <HiDotsHorizontal size={25} color="white" />
                </button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>
                  <h1 className="text-lg">Actions</h1>
                </Menu.Label>
                <Menu.Divider />
                <Menu.Item className="bg-[#F0F0F0]">
                  <Link
                    href={`/admin/survey/responses/${id}/${isTrainee ? "trainee" : "applicant"}/${respondentId}`}
                    className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                  >
                    <VscEye size={21} color="#576074" />
                    View Details
                  </Link>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        );
      },
    },
  ];

  const reviewedCount = filteredResponses.filter(
    (r) => r.status === "REVIEWED"
  ).length;
  const pendingCount = filteredResponses.filter(
    (r) => r.status === "SUBMITTED"
  ).length;

  if (loading) {
    return (
      <div className="w-full p-6  text-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading survey data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 ">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-500 mb-6 hover:underline font-medium"
        >
          <IoArrowBack size={18} /> Back to Surveys
        </button>
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="w-full p-6 ">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-500 mb-6 hover:underline font-medium"
        >
          <IoArrowBack size={18} /> Back to Surveys
        </button>
        <div className="text-center text-gray-600">Survey not found.</div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50">
      <div className=" px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-blue-500 mb-4 hover:underline font-medium"
              >
                <IoArrowBack size={18} /> Back to Surveys
              </button>
              <h1 className="text-3xl font-bold text-blue-600">
                Survey Responses for &quot;{survey.name}&quot;
              </h1>
              <p className="mt-1 text-gray-600">
                Manage and analyze responses for {survey.name}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleExportToExcel}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Download className="w-4 h-4 mr-2" /> Export Excel
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Responses
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalResponses}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                    <CheckCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Reviewed
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {reviewedCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Pending Review
                    </p>
                    <p className="text-2xl font-bold text-amber-600">
                      {pendingCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Review Rate
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {totalResponses > 0
                        ? Math.round((reviewedCount / totalResponses) * 100)
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("responses")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "responses"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Responses
                </div>
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "analytics"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "responses" ? (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    <div className="xl:col-span-2">
                      <Input
                        placeholder="Search responses, names, emails..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        icon={<Search className="w-4 h-4 text-gray-400" />}
                      />
                    </div>
                    <div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                      </Select>
                    </div>
                    <div>
                      <Select
                        value={surveyTypeFilter}
                        onValueChange={setSurveyTypeFilter}
                      >
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="TRAINEESURVEY">
                          Trainee Survey
                        </SelectItem>
                        <SelectItem value="COMPANYSURVEY">
                          Company Survey
                        </SelectItem>
                        <SelectItem value="GENERALSURVEY">
                          General Survey
                        </SelectItem>
                      </Select>
                    </div>
                    <div>
                      <Button
                        onClick={clearFilters}
                        variant="outline"
                        className="w-full"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={dateFromFilter}
                        onChange={(e) => setDateFromFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={dateToFilter}
                        onChange={(e) => setDateToFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <DataTable
                columns={columns}
                data={filteredResponses ?? []}
                loading={loading}
                noDataMessage={
                  responses.length === 0
                    ? "No survey responses have been submitted yet."
                    : "No responses match your current filters."
                }
              />

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Showing page {currentPage} of {totalPages} ({totalResponses}{" "}
                    total responses)
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum =
                          Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                          i;
                        return (
                          <Button
                            key={pageNum}
                            variant={
                              pageNum === currentPage ? "primary" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Analytics Filters */}
              {/* <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
                    <Filter className="w-4 h-4" />
                    <span>Analytics Filters</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Window
                      </label>
                      <input
                        type="text"
                        value={analyticsFilters.window}
                        onChange={(e) => handleAnalyticsFilterChange("window", e.target.value)}
                        placeholder="Enter window"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subwindow
                      </label>
                      <input
                        type="text"
                        value={analyticsFilters.subwindow}
                        onChange={(e) => handleAnalyticsFilterChange("subwindow", e.target.value)}
                        placeholder="Enter subwindow"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sector
                      </label>
                      <input
                        type="text"
                        value={analyticsFilters.sector}
                        onChange={(e) => handleAnalyticsFilterChange("sector", e.target.value)}
                        placeholder="Enter sector"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trade
                      </label>
                      <input
                        type="text"
                        value={analyticsFilters.trade}
                        onChange={(e) => handleAnalyticsFilterChange("trade", e.target.value)}
                        placeholder="Enter trade"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={analyticsFilters.gender}
                        onChange={(e) => handleAnalyticsFilterChange("gender", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Genders</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age Range
                      </label>
                      <select
                        value={analyticsFilters.age}
                        onChange={(e) => handleAnalyticsFilterChange("age", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Ages</option>
                        <option value="18-25">18-25</option>
                        <option value="26-35">26-35</option>
                        <option value="36-45">36-45</option>
                        <option value="46-55">46-55</option>
                        <option value="56+">56+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Province
                      </label>
                      <input
                        type="text"
                        value={analyticsFilters.province}
                        onChange={(e) => handleAnalyticsFilterChange("province", e.target.value)}
                        placeholder="Enter province"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        District
                      </label>
                      <input
                        type="text"
                        value={analyticsFilters.district}
                        onChange={(e) => handleAnalyticsFilterChange("district", e.target.value)}
                        placeholder="Enter district"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cell
                      </label>
                      <input
                        type="text"
                        value={analyticsFilters.cell}
                        onChange={(e) => handleAnalyticsFilterChange("cell", e.target.value)}
                        placeholder="Enter cell"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Village
                      </label>
                      <input
                        type="text"
                        value={analyticsFilters.village}
                        onChange={(e) => handleAnalyticsFilterChange("village", e.target.value)}
                        placeholder="Enter village"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={analyticsFilters.fromDate}
                        onChange={(e) => handleAnalyticsFilterChange("fromDate", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={analyticsFilters.toDate}
                        onChange={(e) => handleAnalyticsFilterChange("toDate", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      onClick={() => processAnalytics()}
                      className="px-6"
                    >
                      Refresh Analytics
                    </Button>
                    <Button
                      onClick={clearAnalyticsFilters}
                      variant="outline"
                      className="px-6"
                    >
                      Clear Analytics Filters
                    </Button>
                  </div>
                </CardContent>
              </Card> */}

                            {/* Analytics Content */}
              <div className="space-y-6">
                {analyticsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <span className="text-gray-600">Processing analytics...</span>
                  </div>
                ) : questionAnalytics.length > 0 ? (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Question Analytics</h2>
                    
                    {/* Group analytics by question type */}
                    {(() => {
                      const groupedAnalytics: { [key: string]: QuestionAnalytics[] } = {};
                      questionAnalytics.forEach(analytics => {
                        if (!groupedAnalytics[analytics.surveyType]) {
                          groupedAnalytics[analytics.surveyType] = [];
                        }
                        groupedAnalytics[analytics.surveyType].push(analytics);
                      });

                      return Object.entries(groupedAnalytics).map(([questionType, typeAnalytics]) => (
                        <div key={questionType} className="mb-8">
                          {/* Section Header */}
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-blue-900 mb-2">
                                  {typeAnalytics[0]?.sectionTitle || questionType}
                                </h3>
                                <p className="text-blue-700 text-sm mb-3">
                                  {typeAnalytics[0]?.sectionDescription || `Questions from the ${questionType} section`}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-blue-600">
                                  <span className="bg-blue-100 px-2 py-1 rounded-full">Type: {questionType}</span>
                                  <span className="bg-blue-100 px-2 py-1 rounded-full">Questions: {typeAnalytics.length}</span>
                                  <span className="bg-blue-100 px-2 py-1 rounded-full">Total Responses: {typeAnalytics.reduce((sum, a) => sum + a.totalResponses, 0)}</span>
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="text-3xl font-bold text-blue-600">
                                  {typeAnalytics.length}
                                </div>
                                <div className="text-sm text-blue-500">Questions</div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Questions in this section */}
                          <div className="space-y-4">
                            {typeAnalytics.map((analytics, index) => (
                              <div key={analytics.questionId} className="relative">
                                <div className="absolute -left-2 top-6 w-4 h-4 bg-blue-200 rounded-full border-2 border-white"></div>
                                {renderQuestionAnalytics(analytics)}
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Available</h3>
                    <p className="text-gray-600 mb-4">
                      {responses.length > 0 
                        ? "No choice-based questions found in the survey responses, or all questions are text-based questions that don't support analytics."
                        : "No survey responses have been submitted yet."
                      }
                    </p>
                    {responses.length > 0 && (
                      <div className="text-left max-w-2xl mx-auto bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Debug Information:</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Total Responses: {responses.length}</p>
                          <p>Survey Type: {survey?.survey_TYPE || 'Unknown'}</p>
                          <p>Questions Found: {responses.reduce((acc, r) => {
                            if (r.parsedAnswers) {
                              r.parsedAnswers.forEach(a => acc.add(a.question));
                            }
                            return acc;
                          }, new Set()).size}</p>
                          <p>Analytics Questions: {questionAnalytics.length}</p>
                          <p>Total Responses Available: {responses.length}</p>
                          <p>Survey Questions Parsed: {survey?.qns ? Object.keys(parseQuestions(survey.qns)).length : 0}</p>
                          <details className="mt-2">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">Show Question Details</summary>
                            <div className="mt-2 space-y-1">
                              {Array.from(responses.reduce((acc: Set<string>, r) => {
                                if (r.parsedAnswers) {
                                  r.parsedAnswers.forEach(a => acc.add(a.question));
                                }
                                return acc;
                              }, new Set<string>())).map((question, index) => (
                                <div key={index} className="text-xs bg-white p-2 rounded border">
                                  <strong>Q{index + 1}:</strong> {String(question)}
                                </div>
                              ))}
                            </div>
                          </details>
                          <details className="mt-2">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">Show Survey Structure</summary>
                            <div className="mt-2">
                              <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                                {JSON.stringify(survey?.qns ? parseQuestions(survey.qns) : {}, null, 2)}
                              </pre>
                            </div>
                          </details>
                          <details className="mt-2">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">Show Raw Survey Data</summary>
                            <div className="mt-2">
                              <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                                {JSON.stringify(survey?.qns || "No survey data", null, 2)}
                              </pre>
                            </div>
                          </details>
                          <details className="mt-2">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">Show Question Types Analysis</summary>
                            <div className="mt-2 space-y-2">
                              {Array.from(responses.reduce((acc: Set<string>, r) => {
                                if (r.parsedAnswers) {
                                  r.parsedAnswers.forEach(a => acc.add(a.question));
                                }
                                return acc;
                              }, new Set<string>())).map((question, index) => {
                                // Try to find question type from survey structure
                                let questionType = "Unknown";
                                let questionId = "Unknown";
                                try {
                                  if (survey?.qns) {
                                    let cleanedQns = survey.qns.trim();
                                    if (cleanedQns.startsWith('("') && cleanedQns.endsWith('")')) {
                                      cleanedQns = cleanedQns.substring(2, cleanedQns.length - 2);
                                    }
                                    if (cleanedQns.startsWith('"') && cleanedQns.endsWith('"')) {
                                      cleanedQns = cleanedQns.substring(1, cleanedQns.length - 1);
                                    }
                                    cleanedQns = cleanedQns.replace(/\\"/g, '"');
                                    cleanedQns = cleanedQns.replace(/([{,])\s*([a-zA-Z0-9_\-]+):/g, '$1"$2":');

                                    const parsed = JSON.parse(cleanedQns);
                                    if (typeof parsed === "object") {
                                      Object.entries(parsed).forEach(([sectionKey, section]: [string, any]) => {
                                        if (section && section.pages && Array.isArray(section.pages)) {
                                          section.pages.forEach((pageContent: any) => {
                                            if (pageContent && pageContent.surveys && Array.isArray(pageContent.surveys)) {
                                              const foundQuestion = pageContent.surveys.find((q: any) => 
                                                q.title === question || q.question === question || q.id === question
                                              );
                                              if (foundQuestion) {
                                                questionType = foundQuestion.type || "No type specified";
                                                questionId = foundQuestion.id || "No ID";
                                              }
                                            }
                                          });
                                        }
                                      });
                                    }
                                  }
                                } catch (error) {
                                  questionType = "Parse error";
                                }
                                
                                return (
                                  <div key={index} className="text-xs bg-white p-2 rounded border">
                                    <strong>Q{index + 1}:</strong> {String(question)}<br/>
                                    <span className="text-gray-600">Type: {questionType} | ID: {questionId}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </details>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyViewPage;
