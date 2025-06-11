"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { IForm, Section, Survey, SurveyResponse } from "@/types/surveys-form";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Tabs, Badge, Card, Text, Divider, Menu } from "@mantine/core";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { CustomDataTable } from "@/components/core/data-table/custom-data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { FiEye } from "react-icons/fi";

interface ParsedAnswer {
  question: string;
  answer: string;
}

// Parse survey questions to create question map
const parseQuestions = (qns: string): { [key: string]: string } => {
  if (!qns) {
    return {};
  }
  try {
    let cleanedQns = qns.trim();
    // Remove outer parentheses and quotes if present (e.g., "({...})")
    if (cleanedQns.startsWith('("') && cleanedQns.endsWith('")')) {
      cleanedQns = cleanedQns.substring(2, cleanedQns.length - 2);
    }
    // Remove outer quotes if still present
    if (cleanedQns.startsWith('"') && cleanedQns.endsWith('"')) {
      cleanedQns = cleanedQns.substring(1, cleanedQns.length - 1);
    }

    // Unescape inner quotes that might have been escaped during stringification
    cleanedQns = cleanedQns.replace(/\\"/g, '"');

    // Regex to find unquoted keys and wrap them in double quotes
    // This handles cases like {key:"value"} -> {"key":"value"}
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
      "Failed to parse survey questions in view page:",
      error,
      "Problematic qns:",
      qns
    );
    notifications.show({
      message: "Failed to parse survey questions data for display.",
      color: "red",
    });
    return {};
  }
};

// Enhanced parse answers function to handle all possible formats
const parseAnswers = (
  answers: string,
  questionMap: { [key: string]: string }
): ParsedAnswer[] => {
  try {
    let cleanedAnswers = answers;
    // Remove outer parentheses and quotes if present (e.g., "({...})")
    if (cleanedAnswers.startsWith('("') && cleanedAnswers.endsWith('")')) {
      cleanedAnswers = cleanedAnswers.substring(2, cleanedAnswers.length - 2);
    }

    // Unescape inner quotes that might have been escaped during stringification
    cleanedAnswers = cleanedAnswers.replace(/\\"/g, '"');

    // Regex to find unquoted keys and wrap them in double quotes
    // This handles cases like {key:"value"} -> {"key":"value"}
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
            if (cleanKey.startsWith('"{') && cleanKey.endsWith('}"')) {
              cleanKey = cleanKey.slice(1, -1);
            }

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
      const patterns = [
        /"question":\s*"([^"]*)"\s*,\s*"answer":\s*"([^"]*)"/g,
        /"question":"([^"]*)","answer":"([^"]*)"/g,
        /question:\s*"([^"]*)"\s*,\s*answer:\s*"([^"]*)"/g,
      ];

      for (const pattern of patterns) {
        const matches = [...answers.matchAll(pattern)];
        if (matches.length > 0) {
          return matches.map((match) => ({
            question: match[1],
            answer: match[2],
          }));
        }
      }

      if (answers.includes('"question"') && answers.includes('"answer"')) {
        const questionRegex = /"question":\s*"([^"]*)"/g;
        const answerRegex = /"answer":\s*"([^"]*)"/g;

        const questions = [...answers.matchAll(questionRegex)];
        const answersMatches = [...answers.matchAll(answerRegex)];

        if (questions.length > 0 && answersMatches.length > 0) {
          const minLength = Math.min(questions.length, answersMatches.length);
          for (let i = 0; i < minLength; i++) {
            results.push({
              question: questions[i][1],
              answer: answersMatches[i][1],
            });
          }
        }
      }

      if (results.length > 0) {
        return results;
      }

      return [
        {
          question: "Survey Response",
          answer: JSON.stringify(parsed, null, 2),
        },
      ];
    }

    return results;
  } catch (error) {
    const patterns = [
      /"question":\s*"([^"]*)"\s*,\s*"answer":\s*"([^"]*)"/g,
      /"question":"([^"]*)","answer":"([^"]*)"/g,
      /question:\s*"([^"]*)"\s*,\s*answer:\s*"([^"]*)"/g,
    ];

    for (const pattern of patterns) {
      const matches = [...answers.matchAll(pattern)];
      if (matches.length > 0) {
        return matches.map((match) => ({
          question: match[1],
          answer: match[2],
        }));
      }
    }

    return [
      {
        question: "Raw Survey Response",
        answer: answers,
      },
    ];
  }
};

// Helper to render answers as readable list
function renderAnswers(answers: any, questionMap: Record<string, string>) {
  const parsedAnswers = parseAnswers(answers, questionMap);

  if (parsedAnswers.length === 0) {
    return <span>No answers</span>;
  }

  // Display only the first answer for brevity in the table, similar to "+X more answers"
  const firstAnswer = parsedAnswers[0];
  const remainingCount = parsedAnswers.length - 1;

  return (
    <div className="flex flex-col">
      <span>{`${firstAnswer.answer}`}</span>
      {remainingCount > 0 && (
        <span className="text-sm text-gray-500">
          +{remainingCount} more answers
        </span>
      )}
    </div>
  );
}

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [survey, setSurvey] = useState<IForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);
  const [responsesLoading, setResponsesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const initialResponsesLoadedRef = React.useRef(false);

  const fetchSurvey = useCallback(async (surveyId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authorizedApi.get(
        `/survey/single-survey/${surveyId}`
      );

      const rawSurveyData = response.data;

      let sections: Section[] = [];
      let parsedQns: any = {};
      try {
        parsedQns = JSON.parse(rawSurveyData.qns);

        sections = Object.entries(parsedQns).map(
          ([sectionName, sectionContent]: [string, any]) => ({
            name: sectionContent.name || sectionName,
            description: sectionContent.description || "",
            questions:
              sectionContent.pages?.flatMap(
                (page: any) => page.surveys || []
              ) || [],
          })
        );
      } catch (parseError) {
        console.error("Error parsing qns JSON:", parseError);
        notifications.show({
          message: "Failed to parse survey questions data.",
          color: "red",
        });
      }

      const structuredSurvey: IForm = {
        ...rawSurveyData,
        sections: sections,
        created_at: rawSurveyData.created_at,
        expiry_date: rawSurveyData.expiry_date,
      };

      setSurvey(structuredSurvey);
      notifications.show({
        message: "Survey data loaded successfully",
        color: "green",
      });
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
  }, []);

  const fetchSurveyResponses = useCallback(
    async (surveyId: string) => {
      if (!survey) {
        console.warn("Survey data not available yet, waiting...");
        return;
      }

      try {
        setResponsesLoading(true);
        const response = await authorizedApi.get(
          `/survey/getSurveyResponses/${surveyId}`
        );

        let responsesData = [];
        if (Array.isArray(response.data)) {
          responsesData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          responsesData = response.data.data;
        } else {
          console.error(
            "API returned data structure is not an array for responses:",
            response.data
          );
          notifications.show({
            title: "Error",
            message: "Received unexpected data format for responses.",
            color: "red",
          });
          return;
        }

        const mappedResponses: SurveyResponse[] = responsesData.map(
          (item: any) => ({
            uuid: item.uuid,
            lastUpdatedAt: item.lastUpdatedAt,
            answers: item.answers,
            status: item.status,
            submitted_at: item.submitted_at,
            applicant: item.applicant,
            trainee: item.trainee,
            reviewed: item.status === "REVIEWED",
          })
        );

        setSurveyResponses(mappedResponses);
        if (!initialResponsesLoadedRef.current) {
          notifications.show({
            message: "Survey responses loaded successfully",
            color: "green",
          });
          initialResponsesLoadedRef.current = true;
        }
      } catch (err: any) {
        console.error("Error fetching survey responses:", err);
        notifications.show({
          message:
            err.response?.data?.message || "Failed to load survey responses",
          color: "red",
        });
        setSurveyResponses([]);
      } finally {
        setResponsesLoading(false);
      }
    },
    [survey]
  );

  // Fetch survey when id changes
  useEffect(() => {
    if (id) {
      const loadSurvey = async () => {
        setLoading(true);
        try {
          await fetchSurvey(id);
        } catch (error) {
          console.error("Error loading survey:", error);
        } finally {
          setLoading(false);
        }
      };
      loadSurvey();
    }
  }, [id, fetchSurvey]);

  // Fetch responses when survey is loaded
  useEffect(() => {
    if (survey && id) {
      fetchSurveyResponses(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [survey, id]);

  useEffect(() => {
    if (survey) {
      if (survey.sections && survey.sections.length > 0) {
        setActiveTab(survey.sections[0].name);
      } else {
        setActiveTab("details");
      }
    }
  }, [survey]);

  const currentSection = survey?.sections?.find(
    (section: Section) => section.name === activeTab
  );

  if (loading) {
    return (
      <div className="w-full !overflow-x-hidden p-6 max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading survey data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full !overflow-x-hidden p-6 max-w-7xl mx-auto">
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
      <div className="w-full !overflow-x-hidden p-6 max-w-7xl mx-auto">
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
  const responseColumns: ColumnDef<SurveyResponse>[] = [
    {
      accessorKey: "applicant",
      header: () => <div className="text-left font-semibold">Applicant</div>,
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.applicant?.name || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "submitted_at",
      header: () => <div className="text-left font-semibold">Timestamp</div>,
      cell: ({ row }) => (
        <div>
          {row.original.submitted_at
            ? format(new Date(row.original.submitted_at), "MMM dd, yyyy HH:mm")
            : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "response",
      header: () => <div className="text-left font-semibold">Response</div>,
      cell: ({ row }) => {
        const questionMap = parseQuestions(survey?.qns || "");
        return (
          <div className="max-w-md truncate" title={row.original.response}>
            {renderAnswers(row.original.answers, questionMap)}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-left font-semibold">Status</div>,
      cell: ({ row }) => (
        <div
          className={`px-3 py-1 rounded-full text-sm w-fit ${row.original.reviewed ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
        >
          {row.original.reviewed ? "Reviewed" : "Pending"}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-right font-semibold">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Menu shadow="lg" width={200} position="bottom-end">
            <Menu.Target>
              <button
                style={{
                  background:
                    "linear-gradient(84.73deg, #005DE9 10.01%, #005DE9 114.53%)",
                }}
                className="p-2.5 rounded-full text-white hover:opacity-90 transition-opacity"
              >
                <HiDotsHorizontal size={18} color="white" />
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>
                <h1 className="text-lg font-medium">Actions</h1>
              </Menu.Label>
              <Menu.Divider />
              <Menu.Item
                leftSection={<FiEye className="h-4 w-4" />}
                onClick={() => {
                  router.push(
                    `/admin/surveys/responses/${id}/${row.original.applicant?.uuid}`
                  );
                }}
              >
                View Details
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full !overflow-x-hidden p-6 max-w-7xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-500 mb-6 hover:underline font-medium"
      >
        <IoArrowBack size={18} /> Back to Surveys
      </button>

      <div className="bg-white rounded-lg shadow p-8 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            {survey.name}
          </h1>
          <Badge
            className={`px-3 py-1 rounded-sm text-xs font-medium uppercase tracking-wider ${
              survey.survey_status === "ONGOING"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {survey.survey_status === "ONGOING" ? "ONGOING" : "ENDED"}
          </Badge>
        </div>

        <p className="text-gray-600 mb-8">{survey.description}</p>

        <div className="mb-10">
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-500 mb-4">
              Survey Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Status:</span>
                <Badge
                  className={`px-3 py-1 rounded-sm text-xs font-medium uppercase ${
                    survey.survey_status === "ONGOING"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {survey.survey_status === "ONGOING" ? "ONGOING" : "ENDED"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Created:</span>
                <span className="text-gray-900">
                  {survey.created_at
                    ? new Date(survey.created_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Expires:</span>
                <span className="text-gray-900">
                  {survey.expiry_date
                    ? new Date(survey.expiry_date).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Sections:</span>
                <span className="text-gray-900">
                  {survey.sections?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-8" />

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Sections & Questions
          </h2>
          <Tabs
            value={activeTab}
            onChange={(value) => setActiveTab(value as string)}
          >
            <Tabs.List>
              {survey.sections?.map((section: Section) => (
                <Tabs.Tab key={section.name} value={section.name}>
                  {section.name}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {survey.sections?.map((section: Section) => (
              <Tabs.Panel key={section.name} value={section.name} pt="xs">
                {currentSection?.questions &&
                currentSection.questions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Question Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Question
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Type
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Required
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentSection.questions.map((question: Survey) => (
                          <tr key={question.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {question.id.includes("-s-")
                                ? question.id.substring(
                                    0,
                                    question.id.lastIndexOf("-s-")
                                  )
                                : question.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {question.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <Badge>{question.type}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {question.required ? "Yes" : "No"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    No questions available for this section.
                  </p>
                )}
              </Tabs.Panel>
            ))}
          </Tabs>
        </div>

        <div className="bg-white rounded-lg shadow p-8 mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Responses
          </h2>
          {responsesLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading responses...</span>
            </div>
          ) : (
            <CustomDataTable
              columns={responseColumns}
              data={surveyResponses}
              loading={responsesLoading}
              noDataMessage={
                surveyResponses.length === 0
                  ? "No responses available for this survey."
                  : ""
              }
              loadingBackgroundColor="#f1f5f9"
              loadingColor="#005DE9"
              pageSize={10}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
