"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import type { IForm } from "@/types/surveys-form";
import SurveyForms from "@/components/forms/SurveyForms";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { Button } from "@mantine/core";
import { IoArrowBack } from "react-icons/io5";
import { Clock, User, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

const ApplicantSurveyPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [survey, setSurvey] = useState<IForm | null>(null);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, any>>({});
  const [submittedResponses, setSubmittedResponses] = useState<Record<string, any>>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"survey" | "responses">("survey");
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  // Fetch logged-in user data
  const fetchUserData = useCallback(async () => {
    try {
      const response = await authorizedApi.get("/auth/me");
      const userData = response.data.data.data;
      if (!userData?.uuid) {
        throw new Error("User UUID not found in response");
      }
      setUserId(userData.uuid);
      if (userData.name) {
        setUserName(userData.name);
      } else if (userData.firstname && userData.lastname) {
        setUserName(`${userData.firstname} ${userData.lastname}`);
      } else if (userData.firstname) {
        setUserName(userData.firstname);
      } else {
        setUserName("");
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      notifications.show({
        message: "Failed to load user data. Please log in again.",
        color: "red",
      });
    }
  }, []);

  // Fetch survey data
  const fetchSurvey = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await authorizedApi.get("/survey/get-all-survey");
      const surveyData = response.data.find((s: any) => s.id.toString() === id);
      
      if (!surveyData) {
        notifications.show({
          message: "Survey not found",
          color: "red",
        });
        router.push("/applicant/surveys");
        return;
      }

      // Transform survey questions
      let transformedQuestions;
      try {
        if (typeof surveyData.qns === "string") {
          const parsed = JSON.parse(surveyData.qns);
          if (Array.isArray(parsed)) {
            transformedQuestions = {
              general: {
                name: "general",
                description: "General Questions",
                pages: [
                  {
                    surveys: parsed.map((item: any, index: number) => ({
                      id: `general-q-0-${index}`,
                      title: item.question || item.title || `Question ${index + 1}`,
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
        }

        const transformedSurvey: IForm = {
          ...surveyData,
          uuid: surveyData.id.toString(),
          id: surveyData.id,
          name: surveyData.name,
          questions: transformedQuestions,
          qns: transformedQuestions,
          created_at: new Date(surveyData.created_at),
          expiry_date: new Date(surveyData.expiry_date),
          survey_status: surveyData.survey_status,
          survey_type: surveyData.survey_TYPE,
          hasSurvey_Started: surveyData.hasSurvey_Started,
          surveyStartingTime: surveyData.surveyStartingTime,
          flag1: surveyData.flag1 || false,
          flag2: surveyData.flag2 || false,
        };

        setSurvey(transformedSurvey);
        setHasSubmitted(surveyData.flag1 || false);
        setHasDraft(surveyData.flag2 || false);

        // Check for existing responses or drafts
        if (userId) {
          await checkUserSurveyData(transformedSurvey);
        }
      } catch (error) {
        console.error("Error transforming survey:", error);
        notifications.show({
          message: "Failed to load survey data",
          color: "red",
        });
      }
    } catch (error) {
      console.error("Error fetching survey:", error);
      notifications.show({
        message: "Failed to load survey",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, [id, userId, router]);

  // Check for existing user responses or drafts
  const checkUserSurveyData = useCallback(async (surveyData: IForm) => {
    if (!userId) return;

    try {
      // Check for submitted response
      const responseResponse = await authorizedApi.get(
        `/survey/survey-responseByApplicant/${id}/${userId}`
      );
      
      if (responseResponse.data?.answers) {
        setSubmittedResponses(JSON.parse(responseResponse.data.answers));

        setHasSubmitted(true);
        setViewMode("responses");
        return;
      }
    } catch (error) {
      // No submitted response found
    }

    try {
      // Check for draft
      const draftResponse = await authorizedApi.get(
        `/survey/get-response-draft?surveyId=${id}&userId=${userId}`
      );
      
      if (draftResponse.data?.answers) {
        setSurveyAnswers(JSON.parse(draftResponse.data.answers));
        console.log(typeof JSON.parse(draftResponse.data.answers));
        setHasDraft(true);
      }
    } catch (error) {
      // No draft found
    }
  }, [id, userId]);

  // Load data on component mount
  useEffect(() => {
    fetchUserData().then(() => {
      if (userId) {
        fetchSurvey();
      }
    });
  }, [fetchUserData, fetchSurvey, userId]);

  // Handle setting survey answers
  const handleSetAnswers = (key: string, value: any) => {
    setSurveyAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [key]: value,
      };

      return newAnswers;
    });
  };

  // Save survey as draft
  const handleSaveDraft = async () => {
    if (!userId || !id) {
      notifications.show({
        message: "User not identified. Please log in again.",
        color: "red",
      });
      return;
    }

    try {
      setSubmitLoading(true);

      await authorizedApi.post("/survey/save-response-draft", {
        survey_id: id,
        answers: JSON.stringify(surveyAnswers),
      });

      setHasDraft(true);
      notifications.show({
        message: "Survey saved as draft successfully",
        color: "green",
      });
      
      // Redirect to survey listing page
      router.push("/applicant/surveys");
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
  const handleSurveySubmit = async () => {
    if (!surveyAnswers || Object.keys(surveyAnswers).length === 0) {
      notifications.show({
        title: "Warning",
        message: "Please answer at least one question before submitting",
        color: "orange",
      });
      return;
    }
    if (!userId || !userName) {
      notifications.show({
        title: "Error",
        message: "User information missing. Please log in again.",
        color: "red",
      });
      return;
    }
    try {
      setSubmitLoading(true);
      const responseData = {
        surveyId: parseInt(id),
        userId: userId,
        userName: userName,
        answers: JSON.stringify(surveyAnswers),
      };
      await authorizedApi.post("/survey/submit-company-survey", responseData);
      
      setHasSubmitted(true);
      setViewMode("responses");
      setSubmittedResponses(surveyAnswers);
      notifications.show({
        title: "Success",
        message: "Thank you for completing the survey!",
        color: "green",
      });
      
      // Redirect to survey listing page after successful submission
      setTimeout(() => {
        router.push("/applicant/surveys");
      }, 2000); // Give user 2 seconds to see the success message
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

  // Handle switching between survey and responses view
  const handleSwitchToSurvey = () => {
    setViewMode("survey");
  };

  const handleSwitchToResponses = () => {
    setViewMode("responses");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-gray-600">Loading survey...</span>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Survey not found
          </h3>
          <p className="text-gray-600 mb-4">
            The requested survey could not be found.
          </p>
          <button
            onClick={() => router.push("/applicant/surveys")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Go back to surveys
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/applicant/surveys")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <IoArrowBack size={18} />
              Back to Surveys
            </button>

            <div className="flex items-center space-x-3">
              {hasSubmitted && (
                <Button
                  variant="outline"
                  onClick={handleSwitchToResponses}
                  className={viewMode === "responses" ? "bg-blue-50 border-blue-200" : ""}
                >
                  View Responses
                </Button>
              )}
              {hasDraft && !hasSubmitted && (
                <Button
                  variant="outline"
                  onClick={handleSwitchToSurvey}
                  className={viewMode === "survey" ? "bg-blue-50 border-blue-200" : ""}
                >
                  Continue Draft
                </Button>
              )}
            </div>
          </div>

          {/* Survey Overview */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {survey.name}
                </h1>
                <div className="flex items-center space-x-3">
                  {hasSubmitted ? (
                    <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      COMPLETED
                    </div>
                  ) : hasDraft ? (
                    <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      DRAFT SAVED
                    </div>
                  ) : (
                    <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {survey.survey_status === "ENDED" ? "ENDED" : "ONGOING"}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Survey Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Survey Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900">
                        {survey.survey_type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-gray-900">
                        {survey.survey_status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium text-gray-900">
                        {survey.created_at.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expires:</span>
                      <span className="font-medium text-gray-900">
                        {survey.expiry_date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Progress */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Your Progress
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-gray-900">
                        {hasSubmitted ? "Completed" : hasDraft ? "Draft Saved" : "Not Started"}
                      </span>
                    </div>
                    {hasSubmitted && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed:</span>
                        <span className="font-medium text-green-600">
                          ✓ Survey submitted
                        </span>
                      </div>
                    )}
                    {hasDraft && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Draft:</span>
                        <span className="font-medium text-yellow-600">
                          ⚠ Work in progress
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Survey Form or Responses */}
          <Card>
            <CardContent className="p-8">
              {viewMode === "survey" ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {hasDraft ? "Continue Your Draft" : "Take Survey"}
                    </h2>
                  </div>

                  {survey.survey_status === "ENDED" ? (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-gray-900 mb-2">
                        Survey has ended
                      </h3>
                      <p className="text-gray-600">
                        This survey is no longer accepting responses.
                      </p>
                    </div>
                  ) : (
                    <SurveyForms
                      mode="answering"
                      formData={{
                        ...survey,
                        qns: survey.questions || survey.qns,
                      }}
                      answers={surveyAnswers}
                      setAnswers={handleSetAnswers}
                      onSaveDraft={handleSaveDraft}
                      onSubmit={handleSurveySubmit}
                      submitLoading={submitLoading}
                      saveLoading={submitLoading}
                    />
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Your Responses
                    </h2>
                    {hasDraft && (
                      <Button
                        variant="outline"
                        onClick={handleSwitchToSurvey}
                      >
                        Continue Draft
                      </Button>
                    )}
                  </div>

                  <SurveyForms
                    mode="viewing"
                    formData={{
                      ...survey,
                      qns: survey.questions || survey.qns,
                    }}
                    answers={submittedResponses}
                    setAnswers={() => {}} // No-op since we're in view mode
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicantSurveyPage; 