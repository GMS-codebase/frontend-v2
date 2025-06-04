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
  const [userId, setUserId] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true); // Track user data loading
  const [viewMode, setViewMode] = useState<"list" | "survey" | "responses">(
    "list"
  );
  const [submittedResponses, setSubmittedResponses] = useState<
    Record<string, any>
  >({});

  // Fetch logged-in user data
  const fetchUserData = useCallback(async () => {
    try {
      setUserLoading(true);
      const response = await authorizedApi.get("/auth/me");
      const userData = response.data.data.data;
      if (!userData?.uuid) {
        throw new Error("User UUID not found in response");
      }
      setUserId(userData.uuid);
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      notifications.show({
        message: "Failed to load user data. Please log in again.",
        color: "red",
      });
    } finally {
      setUserLoading(false);
    }
  }, []);

  // Fetch available surveys for applicants
  const fetchSurveys = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authorizedApi.get("/survey/get-all-survey");

      const availableSurveys = response.data
        .filter((survey: any) => survey.survey_status === ESurveyStatus.ONGOING)
        .map((survey: any) => {
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

  // Load user data and surveys on component mount
  useEffect(() => {
    fetchUserData().then(() => {
      if (userId) {
        fetchSurveys();
      }
    });
  }, [fetchUserData, fetchSurveys, userId]);

  // Fetch draft responses for a survey when selected
  const fetchDraftResponses = useCallback(
    async (surveyId: string) => {
      if (!userId) return;
      try {
        const response = await authorizedApi.get(
          `/survey/survey-draft/${surveyId}/${userId}`
        );
        if (response.data.success && response.data.data?.answers) {
          const draftAnswers = JSON.parse(response.data.data.answers);
          setSurveyAnswers(draftAnswers);
          notifications.show({
            message: "Loaded draft responses",
            color: "blue",
          });
        }
      } catch (error) {
        console.warn("No draft found or error fetching draft:", error);
      }
    },
    [userId]
  );

  // Fetch submitted responses for a survey
  const fetchSubmittedResponses = useCallback(
    async (surveyId: string) => {
      if (!userId) return;
      try {
        const response = await authorizedApi.get(
          `/survey/survey-response/${surveyId}/${userId}`
        );
        if (response.data?.answers) {
          const answers = JSON.parse(response.data.answers);
          setSubmittedResponses(answers);
          setViewMode("responses");
        }
      } catch (error) {
        console.error("Error fetching submitted responses:", error);
        notifications.show({
          message: "Failed to load submitted responses",
          color: "red",
        });
      }
    },
    [userId]
  );

  // Handle setting survey answers
  const handleSetAnswers = (key: string, value: any) => {
    setSurveyAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Save survey as draft
  const handleSaveDraft = async (surveyId: string) => {
    if (!userId) {
      notifications.show({
        message: "User not identified. Please log in again.",
        color: "red",
      });
      return;
    }

    try {
      setSubmitLoading(true);

      await authorizedApi.post("/survey/save-response-draft", {
        survey_id: surveyId,
        answers: JSON.stringify(surveyAnswers),
      });

      notifications.show({
        message: "Survey saved as draft successfully",
        color: "green",
      });
    } catch (error: any) {
      console.error("Error saving draft:", error);
      notifications.show({
        message: error.response?.data?.message || "Failed to save draft",
        color: "red",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle survey submission
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

      const responseData = {
        survey_id: surveyId,
        answers: JSON.stringify(surveyAnswers),
      };

      await authorizedApi.post("/survey/submit-survey", responseData);

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

  // Handle survey selection and check for draft
  const handleSelectSurvey = (survey: IForm) => {
    setSelectedSurvey(survey);
    setViewMode("survey");
    if (survey.uuid && userId) {
      fetchDraftResponses(survey.uuid);
    }
  };

  // Handle viewing submitted responses
  const handleViewResponses = (survey: IForm) => {
    setSelectedSurvey(survey);
    if (survey.uuid) {
      fetchSubmittedResponses(survey.uuid);
    }
  };

  // Handle going back to survey list
  const handleBackToList = () => {
    setSelectedSurvey(null);
    setViewMode("list");
    setSubmittedResponses({});
  };

  if (loading || userLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">
          Unable to load user data. Please log in again.
        </p>
      </div>
    );
  }

  if (selectedSurvey) {
    return (
      <div className="w-full !overflow-x-hidden">
        <div className="flex items-center justify-between my-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToList}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Surveys
            </button>
            <h1 className="text-2xl font-bold">{selectedSurvey.name}</h1>
          </div>
          {viewMode === "survey" && (
            <div className="flex gap-4">
              <Button
                onClick={() => handleSaveDraft(selectedSurvey.uuid || "")}
                loading={submitLoading}
                className="px-6 py-2"
                variant="outline"
                color="blue"
                disabled={submitLoading}
              >
                {submitLoading ? "Saving..." : "Save as Draft"}
              </Button>
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
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-8">
          {viewMode === "survey" ? (
            <SurveyForms
              mode="answering"
              formData={{
                ...selectedSurvey,
                qns: selectedSurvey.questions || selectedSurvey.qns,
              }}
              answers={surveyAnswers}
              setAnswers={handleSetAnswers}
            />
          ) : viewMode === "responses" ? (
            <SurveyForms
              mode="viewing"
              formData={{
                ...selectedSurvey,
                qns: selectedSurvey.questions || selectedSurvey.qns,
              }}
              answers={submittedResponses}
              setAnswers={() => {}} // No-op since we're in view mode
            />
          ) : null}
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

              {completedSurveys.includes(survey.uuid || "") ? (
                <Button
                  onClick={() => handleViewResponses(survey)}
                  className="w-full"
                  variant="filled"
                  color="blue"
                >
                  View Responses
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setSelectedSurvey(survey);
                    setViewMode("survey");
                  }}
                  className="w-full"
                  variant="filled"
                  color={
                    survey.survey_status === ESurveyStatus.ENDED
                      ? "gray"
                      : "blue"
                  }
                  disabled={survey.survey_status === ESurveyStatus.ENDED}
                >
                  {survey.survey_status === ESurveyStatus.ENDED
                    ? "Survey Expired"
                    : "Take Survey"}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
