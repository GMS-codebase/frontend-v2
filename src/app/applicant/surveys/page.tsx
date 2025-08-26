"use client";

import { useEffect, useState, useCallback } from "react";
import type { IForm } from "@/types/surveys-form";
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
import { useRouter } from "next/navigation";

const Page = () => {
  const [surveys, setSurveys] = useState<IForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>("general");
  const router = useRouter();

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
            }

            return {
              ...survey,
              uuid: survey.id.toString(),
              id: survey.id,
              name: survey.name,
              questions: transformedQuestions,
              qns: transformedQuestions,
              created_at: new Date(survey.created_at),
              expiry_date: new Date(survey.expiry_date),
              survey_status: survey.survey_status,
              survey_type: survey.survey_TYPE,
              hasSurvey_Started: survey.hasSurvey_Started,
              surveyStartingTime: survey.surveyStartingTime,
              flag1: survey.flag1 || false, // Submitted response flag
              flag2: survey.flag2 || false, // Draft saved flag
            };
          } catch (error) {
            console.error("Error transforming survey:", error);
            return {
              ...survey,
              uuid: survey.id.toString(),
              id: survey.id,
              name: survey.name,
              questions: {},
              qns: {},
              created_at: new Date(survey.created_at),
              expiry_date: new Date(survey.expiry_date),
              survey_status: survey.survey_status,
              survey_type: survey.survey_TYPE,
              hasSurvey_Started: survey.hasSurvey_Started,
              surveyStartingTime: survey.surveyStartingTime,
              flag1: survey.flag1 || false,
              flag2: survey.flag2 || false,
            };
          }
        });

      setSurveys(availableSurveys);
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

  // Handle survey selection - navigate to individual survey page
  const handleSelectSurvey = (survey: IForm) => {
    router.push(`/applicant/surveys/${survey.id}`);
  };

  // Handle continuing a draft - navigate to individual survey page
  const handleContinueDraft = (survey: IForm) => {
    router.push(`/applicant/surveys/${survey.id}`);
  };

  // Handle viewing responses - navigate to individual survey page
  const handleViewResponses = (survey: IForm) => {
    router.push(`/applicant/surveys/${survey.id}`);
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

  return (
    <div className="font-[Urbanist] text-[1.125rem] font-medium bg-white min-h-screen">
      <div className="w-full !overflow-x-hidden px-6 py-4">
        <div className="">
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
                    const isEnded = survey.survey_status === ESurveyStatus.ENDED;
                    const hasSubmitted = survey.flag1;
                    const hasDraft = survey.flag2;

                    return (
                      <Card
                        key={survey.uuid}
                        className="relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg cursor-pointer"
                        style={{
                          background: hasSubmitted
                            ? "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"
                            : hasDraft
                            ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
                            : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                        }}
                        onClick={() => handleSelectSurvey(survey)}
                      >
                        {/* Status Badge */}
                        {hasSubmitted ? (
                          <div className="absolute top-3 right-3 z-10">
                            <span className="bg-green-500 text-white font-bold text-xs px-4 py-1 rounded-full shadow uppercase tracking-wide">
                              COMPLETED
                            </span>
                          </div>
                        ) : hasDraft ? (
                          <div className="absolute top-3 right-3 z-10">
                            <span className="bg-yellow-500 text-white font-bold text-xs px-4 py-1 rounded-full shadow uppercase tracking-wide">
                              DRAFT SAVED
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
                          {hasSubmitted ? (
                            <Button
                              variant="primary"
                              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewResponses(survey);
                              }}
                            >
                              View Responses
                            </Button>
                          ) : hasDraft ? (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 px-4 py-2 rounded-md transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleContinueDraft(survey);
                                }}
                                disabled={isEnded}
                              >
                                Continue Draft
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="primary"
                              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectSurvey(survey);
                              }}
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
                    const isEnded = survey.survey_status === ESurveyStatus.ENDED;
                    const hasSubmitted = survey.flag1;
                    const hasDraft = survey.flag2;

                    return (
                      <Card
                        key={survey.uuid}
                        className="relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg cursor-pointer"
                        style={{
                          background: hasSubmitted
                            ? "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"
                            : hasDraft
                            ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
                            : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                        }}
                        onClick={() => handleSelectSurvey(survey)}
                      >
                        {/* Status Badge */}
                        {hasSubmitted ? (
                          <div className="absolute top-3 right-3 z-10">
                            <span className="bg-green-500 text-white font-bold text-xs px-4 py-1 rounded-full shadow uppercase tracking-wide">
                              COMPLETED
                            </span>
                          </div>
                        ) : hasDraft ? (
                          <div className="absolute top-3 right-3 z-10">
                            <span className="bg-yellow-500 text-white font-bold text-xs px-4 py-1 rounded-full shadow uppercase tracking-wide">
                              DRAFT SAVED
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
                          {hasSubmitted ? (
                            <Button
                              variant="primary"
                              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewResponses(survey);
                              }}
                            >
                              View Responses
                            </Button>
                          ) : hasDraft ? (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 px-4 py-2 rounded-md transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleContinueDraft(survey);
                                }}
                                disabled={isEnded}
                              >
                                Continue Draft
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="primary"
                              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectSurvey(survey);
                              }}
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
