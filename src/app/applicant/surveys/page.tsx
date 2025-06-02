"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Form as IForm } from "@/types/surveys-form";
import SurveyForms from "@/components/forms/SurveyForms";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { FiClock, FiCalendar, FiFileText, FiCheckCircle } from "react-icons/fi";
import { Button } from "@mantine/core";
import { ESurveyStatus } from "@/types/surveys-form";

const Page = () => {
  const [surveys, setSurveys] = useState<IForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState<IForm | null>(null);
  const [surveyResponses, setSurveyResponses] = useState<Record<string, any>>(
    {}
  );
  const [completedSurveys, setCompletedSurveys] = useState<string[]>([]);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, any>>({});
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch available surveys for applicants
  const fetchSurveys = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authorizedApi.get("/survey/get-all-survey");

      // Filter surveys to show only ONGOING surveys
      const availableSurveys = response.data
        .filter((survey: any) => survey.survey_status === ESurveyStatus.ONGOING)
        .map((survey: any) => {
          // Transform questions to expected format
          let transformedQuestions;
          try {
            if (typeof survey.qns === "string") {
              const parsed = JSON.parse(survey.qns);

              if (Array.isArray(parsed)) {
                // Transform array format to expected structure
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
            uuid: survey.id.toString(),
            id: survey.id,
            name: survey.name,
            description: `Survey created on ${new Date(survey.created_at).toLocaleDateString()}`,
            questions: transformedQuestions,
            qns: transformedQuestions,
            expiry_date: survey.expiry_date,
            survey_status: survey.survey_status,
            created_at: survey.created_at,
            survey_type: survey.survey_TYPE,
            hasSurvey_Started: survey.hasSurvey_Started,
          };
        });

      setSurveys(availableSurveys);

      if (availableSurveys.length === 0) {
        notifications.show({
          message: "No active surveys available at the moment",
          color: "blue",
        });
      }
    } catch (error) {
      console.error("Error fetching surveys:", error);
      notifications.show({
        message: "Failed to load surveys",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Load surveys on component mount
  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  const handleSetAnswers = (key: string, value: any) => {
    setSurveyAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [key]: value,
      };
      
      // Remove empty answers
      Object.keys(newAnswers).forEach(k => {
        if (newAnswers[k] === "" || newAnswers[k] === null || newAnswers[k] === undefined || 
            (Array.isArray(newAnswers[k]) && newAnswers[k].length === 0)) {
          delete newAnswers[k];
        }
      });
      
      return newAnswers;
    });
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

      // Get the current survey
      const survey = surveys.find(s => s.uuid === surveyId);
      if (!survey) {
        throw new Error("Survey not found");
      }

      // Validate required fields
      const questions = survey.questions || survey.qns;
      if (typeof questions === 'string') {
        const parsedQuestions = JSON.parse(questions);
        const requiredQuestions = Object.values(parsedQuestions)
          .flatMap((section: any) => section.pages)
          .flatMap((page: any) => page.surveys)
          .filter((q: any) => q.required);

        const missingRequired = requiredQuestions.some((q: any) => !surveyAnswers[q.id]);
        if (missingRequired) {
          notifications.show({
            title: "Warning",
            message: "Please answer all required questions before submitting",
            color: "orange",
          });
          return;
        }
      }

      // Submit survey response to API
      await authorizedApi.post("/survey/submit-survey", responseData);

      setCompletedSurveys((prev) => [...prev, surveyId]);
      setSelectedSurvey(null);
      setSurveyAnswers({}); // Clear answers

      notifications.show({
        title: "Success",
        message: "Thank you for completing the survey!",
        color: "green",
      });

      // Refresh surveys list
      fetchSurveys();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (selectedSurvey) {
    return (
      <div className="w-full !overflow-x-hidden">
        <div className="flex items-center justify-between my-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedSurvey(null);
                setSurveyAnswers({}); // Clear answers when going back
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Surveys
            </button>
            <h1 className="text-2xl font-bold">{selectedSurvey.name}</h1>
          </div>
          <Button
            onClick={() => handleSurveySubmit(selectedSurvey.uuid || "")}
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
    <div className="w-full !overflow-x-hidden">
      <div className="flex items-center justify-between my-4">
        <p className="text-2xl font-bold">Available Surveys</p>
      </div>
      {surveys.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No surveys available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {surveys.map((survey) => (
            <div
              key={survey.uuid}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6 relative"
            >
              <div className="absolute top-4 right-4">
                {completedSurveys.includes(survey.uuid || "") ? (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 flex items-center gap-1">
                    <FiCheckCircle /> Completed
                  </span>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      survey.survey_status === ESurveyStatus.ONGOING
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {(survey.survey_status ?? "unknown")
                      .charAt(0)
                      .toUpperCase() +
                      (survey.survey_status ?? "unknown").slice(1)}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">{survey.name}</h3>
                <p className="text-gray-600 text-sm">{survey.description}</p>
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-gray-400" />
                  <span>
                    Created: {new Date(survey.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="text-gray-400" />
                  <span>
                    Expires:{" "}
                    {new Date(survey.expiry_date || "").toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FiFileText className="text-gray-400" />
                  <span>
                    {Object.keys(survey.questions || {}).length} Sections
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setSelectedSurvey(survey)}
                className="w-full"
                variant="filled"
                color={
                  survey.survey_status === ESurveyStatus.EXPIRED ||
                  completedSurveys.includes(survey.uuid || "")
                    ? "gray"
                    : "blue"
                }
                disabled={
                  survey.survey_status === ESurveyStatus.EXPIRED ||
                  completedSurveys.includes(survey.uuid || "")
                }
              >
                {completedSurveys.includes(survey.uuid || "")
                  ? "Survey Completed"
                  : survey.survey_status === ESurveyStatus.EXPIRED
                    ? "Survey Expired"
                    : "Take Survey"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
