"use client";
import { useEffect, useState, useCallback } from "react";
import type { IForm } from "@/types/surveys-form";
import SurveyForms from "@/components/forms/SurveyForms";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import {
  FiClock,
  FiCalendar,
  FiFileText,
  FiCheckCircle,
  FiPlay,
  FiEye,
} from "react-icons/fi";
import {
  Button,
  Tabs,
  Badge,
  Card,
  Group,
  Text,
  Stack,
  Menu,
} from "@mantine/core";
import { ESurveyStatus } from "@/types/surveys-form";
import { HiDotsHorizontal } from "react-icons/hi";

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
  const [userName, setUserName] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "survey" | "responses">(
    "list"
  );
  const [submittedResponses, setSubmittedResponses] = useState<
    Record<string, any>
  >({});
  const [activeTab, setActiveTab] = useState<string | null>("general");

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
        .filter(
          (survey: any) =>
            (survey.survey_status === ESurveyStatus.ONGOING ||
              survey.survey_status === "expired" ||
              new Date(survey.expiry_date) < new Date()) &&
            (survey.survey_TYPE === "GENERALSURVEY" ||
              survey.survey_TYPE === "COMPANYSURVEY")
        )
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

          // Normalize status
          const isExpired =
            survey.survey_status === "expired" ||
            new Date(survey.expiry_date) < new Date();
          const normalizedStatus = isExpired
            ? ESurveyStatus.ENDED
            : survey.survey_status;

          return {
            uuid: survey.id.toString(),
            id: survey.id,
            name: survey.name,
            description: `Survey created on ${new Date(survey.created_at).toLocaleDateString()}`,
            questions: transformedQuestions,
            qns: transformedQuestions,
            expiry_date: survey.expiry_date,
            survey_status: normalizedStatus,
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
        } else {
          notifications.show({
            message: "No submitted responses found.",
            color: "blue",
          });
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
    setSurveyAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [key]: value,
      };

      // Remove empty answers
      Object.keys(newAnswers).forEach((k) => {
        if (
          newAnswers[k] === "" ||
          newAnswers[k] === null ||
          newAnswers[k] === undefined ||
          (Array.isArray(newAnswers[k]) && newAnswers[k].length === 0)
        ) {
          delete newAnswers[k];
        }
      });

      return newAnswers;
    });
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
  const handleSurveySubmit = async (surveyId: string | number) => {
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
        surveyId:
          typeof surveyId === "string"
            ? Number.parseInt(surveyId, 10)
            : surveyId,
        userId: userId,
        userName: userName,
        answers: JSON.stringify(surveyAnswers),
      };
      await authorizedApi.post("/survey/submit-survey", responseData);
      setCompletedSurveys((prev) => [...prev, String(surveyId)]);
      setSelectedSurvey(null);
      setSurveyAnswers({});
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

  // Filter surveys by type
  const filteredSurveys = surveys.filter((survey) => {
    if (activeTab === "general") {
      return survey.survey_type === "GENERALSURVEY";
    } else if (activeTab === "company") {
      return survey.survey_type === "COMPANYSURVEY";
    }
    return true;
  });

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
      <div className="font-[Urbanist] text-[1.125rem] font-medium bg-white min-h-screen">
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
      </div>
    );
  }

  return (
    <div className="font-[Urbanist] text-[1.125rem] font-medium bg-white min-h-screen">
      <div className="w-full !overflow-x-hidden px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Available Surveys
            </h1>
          </div>

          <Tabs value={activeTab} onChange={setActiveTab} className="mb-8">
            <Tabs.List className="mb-6">
              <Tabs.Tab value="general" className="text-lg px-6 py-3">
                General Surveys
              </Tabs.Tab>
              <Tabs.Tab value="company" className="text-lg px-6 py-3">
                Company Surveys
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="general">
              {filteredSurveys.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiFileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-xl text-gray-500 mb-2">
                    No surveys available
                  </p>
                  <p className="text-gray-400">
                    Check back later for new general surveys.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSurveys.map((survey) => {
                    const isCompleted = completedSurveys.includes(
                      survey.uuid || ""
                    );
                    const isEnded =
                      survey.survey_status === ESurveyStatus.ENDED;

                    return (
                      <Card
                        key={survey.uuid}
                        className="relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg"
                        style={{
                          background: isCompleted
                            ? "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"
                            : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                        }}
                      >
                        {/* Status Badge */}
                        {isCompleted ? (
                          <div className="absolute top-3 right-3 z-10">
                            <span className="bg-green-500 text-white font-bold text-xs px-4 py-1 rounded-full shadow uppercase tracking-wide">
                              COMPLETED
                            </span>
                          </div>
                        ) : (
                          <div className="absolute top-4 right-4 z-10">
                            <Badge
                              color={isEnded ? "red" : "green"}
                              variant="filled"
                              className="px-3 py-1"
                            >
                              {isEnded ? "Ended" : "Ongoing"}
                            </Badge>
                          </div>
                        )}

                        <Card.Section className="p-6 pb-4">
                          <Group
                            justify="space-between"
                            align="flex-start"
                            className="mb-4"
                          >
                            <div className="flex-1 pr-16">
                              <Text
                                size="xl"
                                fw={600}
                                className="text-gray-900 mb-2 leading-tight"
                              >
                                {survey.name}
                              </Text>
                              <Text
                                size="sm"
                                c="dimmed"
                                className="line-clamp-2"
                              >
                                {survey.description}
                              </Text>
                            </div>
                          </Group>

                          {/* Survey Details */}
                          <Stack gap="xs" className="mb-6">
                            <Group gap="xs" className="text-sm text-gray-600">
                              <FiCalendar
                                className="text-blue-500 flex-shrink-0"
                                size={16}
                              />
                              <Text size="sm">
                                {new Date(survey.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </Text>
                            </Group>

                            <Group gap="xs" className="text-sm text-gray-600">
                              <FiClock
                                className="text-orange-500 flex-shrink-0"
                                size={16}
                              />
                              <Text size="sm">
                                Ending Date{" "}
                                {new Date(
                                  survey.expiry_date || ""
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </Text>
                            </Group>

                            <Group gap="xs" className="text-sm text-gray-600">
                              <FiFileText
                                className="text-purple-500 flex-shrink-0"
                                size={16}
                              />
                              <Text size="sm">
                                {Object.keys(survey.questions || {}).length}{" "}
                                Section
                                {Object.keys(survey.questions || {}).length !==
                                1
                                  ? "s"
                                  : ""}
                              </Text>
                            </Group>
                          </Stack>

                          {/* Action Button */}
                          {isCompleted ? (
                            <Button
                              variant="primary"
                              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
                              onClick={() => handleViewResponses(survey)}
                            >
                              View Responses
                            </Button>
                          ) : (
                            <Button
                              variant="primary"
                              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
                              onClick={() => handleSelectSurvey(survey)}
                              disabled={isEnded}
                            >
                              {isEnded ? "Survey Ended" : "Take Survey"}
                            </Button>
                          )}
                        </Card.Section>
                      </Card>
                    );
                  })}
                </div>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="company">
              {filteredSurveys.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiFileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-xl text-gray-500 mb-2">
                    No surveys available
                  </p>
                  <p className="text-gray-400">
                    Check back later for new company surveys.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSurveys.map((survey) => {
                    const isCompleted = completedSurveys.includes(
                      survey.uuid || ""
                    );
                    const isEnded =
                      survey.survey_status === ESurveyStatus.ENDED;

                    return (
                      <Card
                        key={survey.uuid}
                        className="relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg"
                        style={{
                          background: isCompleted
                            ? "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"
                            : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                        }}
                      >
                        {/* Status Badge */}
                        {isCompleted ? (
                          <div className="absolute top-3 right-3 z-10">
                            <span className="bg-green-500 text-white font-bold text-xs px-4 py-1 rounded-full shadow uppercase tracking-wide">
                              COMPLETED
                            </span>
                          </div>
                        ) : (
                          <div className="absolute top-4 right-4 z-10">
                            <Badge
                              color={isEnded ? "red" : "green"}
                              variant="filled"
                              className="px-3 py-1"
                            >
                              {isEnded ? "Ended" : "Ongoing"}
                            </Badge>
                          </div>
                        )}

                        <Card.Section className="p-6 pb-4">
                          <Group
                            justify="space-between"
                            align="flex-start"
                            className="mb-4"
                          >
                            <div className="flex-1 pr-16">
                              <Text
                                size="xl"
                                fw={600}
                                className="text-gray-900 mb-2 leading-tight"
                              >
                                {survey.name}
                              </Text>
                              <Text
                                size="sm"
                                c="dimmed"
                                className="line-clamp-2"
                              >
                                {survey.description}
                              </Text>
                            </div>
                          </Group>

                          {/* Survey Details */}
                          <Stack gap="xs" className="mb-6">
                            <Group gap="xs" className="text-sm text-gray-600">
                              <FiCalendar
                                className="text-blue-500 flex-shrink-0"
                                size={16}
                              />
                              <Text size="sm">
                                {new Date(survey.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </Text>
                            </Group>

                            <Group gap="xs" className="text-sm text-gray-600">
                              <FiClock
                                className="text-orange-500 flex-shrink-0"
                                size={16}
                              />
                              <Text size="sm">
                                Ending Date{" "}
                                {new Date(
                                  survey.expiry_date || ""
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </Text>
                            </Group>

                            <Group gap="xs" className="text-sm text-gray-600">
                              <FiFileText
                                className="text-purple-500 flex-shrink-0"
                                size={16}
                              />
                              <Text size="sm">
                                {Object.keys(survey.questions || {}).length}{" "}
                                Section
                                {Object.keys(survey.questions || {}).length !==
                                1
                                  ? "s"
                                  : ""}
                              </Text>
                            </Group>
                          </Stack>

                          {/* Action Button */}
                          {isCompleted ? (
                            <Button
                              variant="primary"
                              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
                              onClick={() => handleViewResponses(survey)}
                            >
                              View Responses
                            </Button>
                          ) : (
                            <Button
                              variant="primary"
                              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
                              onClick={() => handleSelectSurvey(survey)}
                              disabled={isEnded}
                            >
                              {isEnded ? "Survey Ended" : "Take Survey"}
                            </Button>
                          )}
                        </Card.Section>
                      </Card>
                    );
                  })}
                </div>
              )}
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Page;
