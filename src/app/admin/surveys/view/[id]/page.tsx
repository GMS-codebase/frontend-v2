"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import {
  Form as IForm,
  Section,
  Survey,
  SurveyResponse,
} from "@/types/surveys-form";
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

  const fetchSurveyResponses = useCallback(async (surveyId: string) => {
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
        (item: any) => {
          let formattedResponse = "No answers provided";
          if (item.answers && typeof item.answers === "string") {
            formattedResponse = item.answers;
            // Truncate long responses
            const maxLength = 100; // Define maximum length for the displayed response
            if (formattedResponse.length > maxLength) {
              formattedResponse =
                formattedResponse.substring(0, maxLength) + "...";
            }
          } else if (item.answers !== undefined && item.answers !== null) {
            // Handle cases where answers might be something other than a string, convert to string
            formattedResponse = String(item.answers);
            // Truncate long responses
            const maxLength = 100; // Define maximum length for the displayed response
            if (formattedResponse.length > maxLength) {
              formattedResponse =
                formattedResponse.substring(0, maxLength) + "...";
            }
          }

          return {
            ...item,
            response: formattedResponse,
            applicant: item.applicant,
            survey: item.survey,
            uuid: item.uuid,
            reviewed: item.reviewed,
          };
        }
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
  }, []);

  useEffect(() => {
    if (id) {
      const loadData = async () => {
        setLoading(true);
        try {
          await fetchSurvey(id);
          fetchSurveyResponses(id);
        } catch (error) {
          console.error("Error in initial data load effect:", error);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [id, fetchSurvey, fetchSurveyResponses]);

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
      cell: ({ row }) => (
        <div className="max-w-md truncate" title={row.original.response}>
          {row.original.response}
        </div>
      ),
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
                    `/admin/surveys/responses/${row.original.survey?.id || id}/${row.original.applicant?.uuid}`
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
            {survey.survey_status === "ONGOING" ? "ONGOING" : "EXPIRED"}
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
                  {survey.survey_status === "ONGOING" ? "ONGOING" : "EXPIRED"}
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
