"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Card, Text, Stack, Group, Button, Modal } from "@mantine/core";
import { useRouter } from "next13-progressbar";
import { unauthorizedApi, authorizedApi } from "@/utils/api";
import { setCookie, getCookie } from "cookies-next";
import { notifications } from "@mantine/notifications";
import SurveyForms from "@/components/forms/SurveyForms";
import { ESurveyStatus } from "@/types/surveys-form";

type Survey = {
  id: number;
  name: string;
  qns: string;
  expiry_date: string;
  survey_status: ESurveyStatus;
  created_at: string;
  updated_at: string;
  survey_TYPE: string;
  hasSurvey_Started: boolean;
  surveyStartingTime: string | null;
  questions?: any;
};

export default function TraineeSurveys() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, any>>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [completedSurveys, setCompletedSurveys] = useState<string[]>([]);
  const [tabIndex, setTabIndex] = useState(0); // 0: Ongoing, 1: Ended
  const [traineeUuid, setTraineeUuid] = useState<string | null>(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultLoading, setResultLoading] = useState(false);
  const [resultError, setResultError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [resultParsedAnswers, setResultParsedAnswers] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    const initializeSurveys = async () => {
      const traineeData = localStorage.getItem("traineeData");

      if (!traineeData) {
        router.replace("/");
        return;
      }

      try {
        const parsedData = JSON.parse(traineeData);

        if (!parsedData.isAuthenticated || parsedData.role !== "TRAINEE") {
          router.replace("/");
          return;
        }

        // Set the token in cookies for the API
        if (parsedData.token) {
          setCookie("token", parsedData.token);
        }

        // Fetch surveys from API with trainee email
        const response = await unauthorizedApi.get("/survey/get-all-survey", {
          params: {
            email: parsedData.email,
          },
        });

        // Filter surveys to show both TRAINEESURVEY and GENERALSURVEY types
        const traineeSurveys = response.data
          .filter(
            (survey: Survey) =>
              ["TRAINEESURVEY", "GENERALSURVEY"].includes(survey.survey_TYPE.toUpperCase())
          )
          .map((survey: Survey) => {
            // Transform questions to expected format
            let transformedQuestions;
            try {
              if (typeof survey.qns === "string") {
                const parsed = JSON.parse(survey.qns);
                if (Array.isArray(parsed)) {
                  transformedQuestions = {
                    general: {
                      name: "general",
                      description: "General Questions",
                      pages: [
                        {
                          surveys: parsed.map((item: any, index: number) => ({
                            id: `general-q-0-${index}`,
                            title:
                              item.question ||
                              item.title ||
                              `Question ${index + 1}`,
                            description: item.description || "",
                            type: item.type || "text",
                            required: item.required || false,
                            commentable: item.commentable || false,
                            choices: item.choices || [],
                            columns: item.columns || [],
                          })),
                        },
                      ],
                    },
                  };
                } else if (typeof parsed === "object" && parsed !== null) {
                  transformedQuestions = parsed;
                } else {
                  transformedQuestions = {};
                }
              } else {
                transformedQuestions = survey.qns || {};
              }
            } catch (parseError) {
              console.warn("Failed to parse survey questions:", parseError);
              transformedQuestions = {};
            }

            return {
              ...survey,
              questions: transformedQuestions,
              qns: transformedQuestions,
              survey_status: survey.survey_status as ESurveyStatus,
            };
          });

        if (isMounted) {
          setSurveys(traineeSurveys);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching surveys:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeSurveys();

    return () => {
      isMounted = false;
    };
  }, []);

  // Get traineeUuid from localStorage
  useEffect(() => {
    const traineeData = localStorage.getItem("traineeData");
    if (traineeData) {
      try {
        const parsed = JSON.parse(traineeData);
        setTraineeUuid(parsed.uuid || parsed.profile?.uuid || null);
      } catch {
        setTraineeUuid(null);
      }
    } else {
      setTraineeUuid(null);
    }
  }, []);

  const handleSetAnswers = (key: string, value: any) => {
    setSurveyAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSurveySubmit = async (surveyId: string) => {
    if (!surveyAnswers || Object.keys(surveyAnswers).length === 0) {
      notifications.show({
        title: "Warning",
        message: "Please answer at least one question before submitting",
        color: "orange",
      });
      return;
    }

    try {
      setSubmitLoading(true);

      const traineeData = localStorage.getItem("traineeData");
      if (!traineeData) {
        throw new Error("Trainee data not found");
      }

      const { uuid, email } = JSON.parse(traineeData);

      const responseData = {
        surveyId: parseInt(surveyId),
        traineeUuid: uuid,
        answers: JSON.stringify(surveyAnswers),
      };

      await authorizedApi.post("/survey/submit-survey/trainee", responseData, {
        headers: {
          email: email,
        },
      });

      setCompletedSurveys((prev) => [...prev, surveyId]);
      setSelectedSurvey(null);
      setSurveyAnswers({});

      notifications.show({
        title: "Success",
        message: "Thank you for completing the survey!",
        color: "green",
      });
    } catch (error: any) {
      console.error("Error submitting survey:", error);
      notifications.show({
        title: "Error",
        message:
          error.response?.data?.message ||
          "Failed to submit survey. Please try again.",
        color: "red",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const getSurveyStatusColor = (status: string) => {
    switch (status) {
      case "ONGOING":
        return "blue";
      case "ENDED":
        return "gray";
      case "DRAFT":
        return "yellow";
      default:
        return "blue";
    }
  };

  const getSurveyStatusText = (status: string) => {
    switch (status) {
      case "ONGOING":
        return "Take Survey";
      case "ENDED":
        return "View Results";
      case "DRAFT":
        return "Coming Soon";
      default:
        return "Take Survey";
    }
  };

  // Tab filtering logic
  const filteredSurveys = surveys.filter((survey) =>
    tabIndex === 0
      ? survey.survey_status === "ONGOING"
      : survey.survey_status === "ENDED"
  );

  // Parse questions helper (from SDF)
  const parseQuestions = (qns: string): { [key: string]: string } => {
    try {
      const parsed = JSON.parse(qns);
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
              if (pageContent && pageContent.surveys && Array.isArray(pageContent.surveys)) {
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
    } catch {
      return {};
    }
  };

  // Parse answers helper (from SDF)
  const parseAnswers = (answers: string, questionMap: { [key: string]: string }) => {
    try {
      const parsed = JSON.parse(answers);
      const results: any[] = [];
      if (typeof parsed === "object" && parsed !== null) {
        Object.entries(parsed).forEach(([key, value]) => {
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
              question: item.question || questionMap[index.toString()] || `Question ${index + 1}`,
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
      return results;
    } catch {
      return [];
    }
  };

  // Handle View Results
  const handleViewResults = async (surveyId: number) => {
    // Always get the latest traineeUuid from localStorage
    let uuid = traineeUuid;
    const traineeData = localStorage.getItem("traineeData");
    if (traineeData) {
      try {
        const parsed = JSON.parse(traineeData);
        uuid = parsed.uuid || parsed.profile?.uuid || null;
      } catch {
        uuid = null;
      }
    }
    if (!uuid) {
      notifications.show({ title: "Error", message: "Trainee not found", color: "red" });
      return;
    }
    setResultModalOpen(true);
    setResultLoading(true);
    setResultError(null);
    setResultData(null);
    setResultParsedAnswers([]);
    try {
      const token = getCookie("token");
      const res = await authorizedApi.get(`/survey/survey-responseByTrainee/${surveyId}/${uuid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResultData(res.data);
      // Parse answers
      let questionMap = {};
      if (res.data.survey?.qns) questionMap = parseQuestions(res.data.survey.qns);
      setResultParsedAnswers(parseAnswers(res.data.answers, questionMap));
    } catch (err: any) {
      setResultError(err?.response?.data?.message || "Failed to fetch survey result");
    } finally {
      setResultLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Text size="xl" fw={500} mb={10}>
            Loading Surveys...
          </Text>
          <Text size="sm" c="dimmed">
            Please wait while we fetch your surveys
          </Text>
        </div>
      </div>
    );
  }

  if (selectedSurvey) {
    return (
      <div className="w-full !overflow-x-hidden p-6">
        <div className="flex items-center justify-between my-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedSurvey(null);
                setSurveyAnswers({});
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Surveys
            </button>
            <Text size="xl" fw={700}>
              {selectedSurvey.name}
            </Text>
          </div>
          <Button
            onClick={() => handleSurveySubmit(selectedSurvey.id.toString())}
            loading={submitLoading}
            className="px-6 py-2"
            variant="filled"
            color="blue"
            disabled={submitLoading}
          >
            {submitLoading ? "Submitting..." : "Submit Survey"}
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow p-8">
          <SurveyForms
            mode="answering"
            formData={{
              ...selectedSurvey,
              qns: selectedSurvey.questions || selectedSurvey.qns,
            }}
            answers={surveyAnswers}
            setAnswers={handleSetAnswers}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Text size="xl" fw={700} mb={6}>
        Available Surveys
      </Text>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`relative px-6 py-2 text-base font-medium focus:outline-none transition-colors duration-150 ${
            tabIndex === 0 ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setTabIndex(0)}
          aria-selected={tabIndex === 0}
          tabIndex={0}
        >
          Ongoing Surveys
          {tabIndex === 0 && (
            <span className="absolute left-0 right-0 -bottom-1 h-1 bg-blue-600 rounded-t"></span>
          )}
        </button>
        <button
          className={`relative px-6 py-2 text-base font-medium focus:outline-none transition-colors duration-150 ${
            tabIndex === 1 ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setTabIndex(1)}
          aria-selected={tabIndex === 1}
          tabIndex={0}
        >
          Ended Surveys
          {tabIndex === 1 && (
            <span className="absolute left-0 right-0 -bottom-1 h-1 bg-blue-600 rounded-t"></span>
          )}
        </button>
      </div>
      <Stack gap="md">
        {filteredSurveys.length === 0 ? (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Text c="dimmed" ta="center">
              No surveys available at the moment
            </Text>
          </Card>
        ) : (
          filteredSurveys.map((survey) => (
            <Card key={survey.id} shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" align="flex-start">
                <Stack gap={4}>
                  <Text size="lg" fw={500}>
                    {survey.name}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Expires: {new Date(survey.expiry_date).toLocaleDateString()}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Status: {survey.survey_status}
                  </Text>
                </Stack>
                <Button
                  variant="filled"
                  color={getSurveyStatusColor(survey.survey_status)}
                  disabled={
                    survey.survey_status === "DRAFT" ||
                    completedSurveys.includes(survey.id.toString())
                  }
                  onClick={() =>
                    survey.survey_status === "ONGOING"
                      ? setSelectedSurvey(survey)
                      : handleViewResults(survey.id)
                  }
                >
                  {completedSurveys.includes(survey.id.toString())
                    ? "Survey Completed"
                    : getSurveyStatusText(survey.survey_status)}
                </Button>
              </Group>
            </Card>
          ))
        )}
      </Stack>
      {/* Result Modal */}
      <Modal opened={resultModalOpen} onClose={() => setResultModalOpen(false)} size="lg" centered>
        <div className="p-6">
          {resultLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <span className="text-gray-600">Loading result...</span>
            </div>
          ) : resultError ? (
            <div className="text-red-500 text-center min-h-[200px]">{resultError}</div>
          ) : resultData ? (
            <div>
              <h2 className="text-2xl font-bold mb-2">Survey Result</h2>
              <div className="mb-4">
                <div className="font-semibold">Survey: <span className="font-normal">{resultData.survey?.name}</span></div>
                <div className="font-semibold">Status: <span className="font-normal">{resultData.status}</span></div>
                <div className="font-semibold">Submitted: <span className="font-normal">{resultData.submitted_at ? new Date(resultData.submitted_at).toLocaleString() : "N/A"}</span></div>
              </div>
              <div className="mb-4">
                <div className="font-semibold">Trainee Name: <span className="font-normal">{resultData.trainee?.name}</span></div>
                <div className="font-semibold">Email: <span className="font-normal">{resultData.trainee?.email}</span></div>
                <div className="font-semibold">Phone: <span className="font-normal">{resultData.trainee?.phone}</span></div>
                <div className="font-semibold">National ID: <span className="font-normal">{resultData.trainee?.nationalId}</span></div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Responses</h3>
                {resultParsedAnswers.length === 0 ? (
                  <div className="text-gray-500">No responses found.</div>
                ) : (
                  <ul className="space-y-4">
                    {resultParsedAnswers.map((ans, idx) => (
                      <li key={idx} className="border-b pb-2">
                        <div className="font-medium">Q{idx + 1}: {ans.question}</div>
                        <div className="ml-4 text-gray-700">{ans.answer}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
