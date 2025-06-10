"use client";

import { useState, useCallback, useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";
import type { ColumnDef } from "@tanstack/react-table";
import { CustomDataTable } from "@/components/core/data-table/custom-data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { useDisclosure } from "@mantine/hooks";
import { Menu } from "@mantine/core";
import { FiEye, FiPlay, FiDownload } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { MdStop } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import Link from "next/link";
import DeleteModal from "@/components/Modals/DeleteModal";
import EndSurveyModal from "@/components/survey/EndSurveyModal";
import { format } from "date-fns";
import type { Survey, SurveyResponse } from "./types";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { ESurveyStatus } from "@/types/surveys-form";
import ExportExcel from "@/components/core/reports/export_excel";
import { Card, CardContent } from "@/components/ui/Card";
import {
  FileText,
  CheckCheck,
  Clock,
  User,
  Filter,
  Calendar,
} from "lucide-react";
import { Select, SelectItem } from "@/components/ui/Select";

interface SurveyWithResponseCount extends Survey {
  responseCount: number;
}

// Helper to build a map from question ID to question text
function getQuestionMap(qns: string | any): Record<string, string> {
  let questionMap: Record<string, string> = {};
  try {
    const parsed = typeof qns === "string" ? JSON.parse(qns) : qns;
    if (Array.isArray(parsed)) {
      parsed.forEach((q, idx) => {
        const id = q.id || `general-q-0-${idx}`;
        questionMap[id] = q.question || q.title || `Question ${idx + 1}`;
      });
    } else if (typeof parsed === "object" && parsed !== null) {
      Object.values(parsed).forEach((section: any) => {
        if (section.pages) {
          section.pages.forEach((page: any) => {
            if (page.surveys) {
              page.surveys.forEach((q: any) => {
                if (q.id) {
                  questionMap[q.id] = q.title || q.question || q.id;
                }
              });
            }
          });
        }
      });
    }
  } catch (e) {
    // fallback: return empty map
  }
  return questionMap;
}

// Helper to render answers as readable list
function renderAnswers(answers: any, questionMap: Record<string, string>) {
  // Try to parse answers if it's a string
  let parsed = answers;
  if (typeof answers === "string") {
    try {
      parsed = JSON.parse(answers);
    } catch {
      try {
        parsed = JSON.parse(JSON.parse(answers));
      } catch {
        // If it's just a plain string, show as is
        if (answers.trim().length > 0 && answers.trim()[0] !== '{') {
          return <span>{answers}</span>;
        }
        return <span style={{ color: "red" }}>Unreadable answer format</span>;
      }
    }
  }
  if (typeof parsed !== "object" || parsed === null) {
    return <span>No answers</span>;
  }
  return (
    <ul className="list-disc pl-4">
      {Object.entries(parsed).map(([id, value]) => (
        <li key={id}>
          <strong>{questionMap[id] || id}:</strong> {String(value)}
        </li>
      ))}
    </ul>
  );
}

const SurveyPage = () => {
  const [activeTab, setActiveTab] = useState<
    "all" | "ongoing" | "ended" | "responsesPerType"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  // State for surveys and responses
  const [surveys, setSurveys] = useState<SurveyWithResponseCount[]>([]);
  const [allResponses, setAllResponses] = useState<SurveyResponse[]>([]); // State for all responses
  const [loading, setLoading] = useState(true); // Loading for initial fetch of surveys and all responses

  // State for survey statistics
  const [totalSurveys, setTotalSurveys] = useState(0);
  const [ongoingSurveys, setOngoingSurveys] = useState(0);
  const [endedSurveys, setEndedSurveys] = useState(0);
  const [totalResponses, setTotalResponses] = useState(0);
  const [surveysWithResponses, setSurveysWithResponses] = useState(0);
  const [surveysPendingResponse, setSurveysPendingResponse] = useState(0);

  // Modal controls
  const [
    isOpenEndSurvey,
    { open: openEndSurveyModal, close: closeEndSurveyModal },
  ] = useDisclosure(false);
  const [isOpenDelete, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter states
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCreatedFrom, setFilterCreatedFrom] = useState<string>("");
  const [filterCreatedTo, setFilterCreatedTo] = useState<string>("");
  const [filterExpiryFrom, setFilterExpiryFrom] = useState<string>("");
  const [filterExpiryTo, setFilterExpiryTo] = useState<string>("");

  // Fetch surveys from API
  const fetchSurveys = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authorizedApi.get("/survey/get-all-survey");

      // Map the API response to match our table structure
      const mappedSurveys = response.data.map((survey: any) => ({
        uuid: survey.id.toString(), // Use id as uuid for actions
        id: survey.id,
        name: survey.name,
        questions: survey.qns,
        expiry_date: survey.expiry_date,
        survey_status: survey.survey_status,
        created_at: survey.created_at,
        updated_at: survey.updated_at,
        survey_type: survey.survey_TYPE,
        hasSurvey_Started: survey.hasSurvey_Started,
        surveyStartingTime: survey.surveyStartingTime,
      }));

      setSurveys(mappedSurveys);
      notifications.show({
        message: "Surveys loaded successfully",
        color: "green",
      });
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

  // Fetch survey responses from API
  const fetchResponses = useCallback(async (surveyId: string | null = null) => {
    try {
      // Add your API endpoint for responses here
      const url = surveyId
        ? `/survey/getSurveyResponses/${surveyId}`
        : "/survey/getAllSurveyResponses";

      const response = await authorizedApi.get(url);

      let responsesData = [];

      // Check if the data is an array directly or nested within a 'data' property
      if (Array.isArray(response.data)) {
        responsesData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        responsesData = response.data.data;
      } else {
        console.error(
          "API returned data structure is not an array:",
          response.data
        );
        notifications.show({
          title: "Error",
          message: "Received unexpected data format for responses.",
          color: "red",
        });
        return []; // Return empty array on error
      }

      // Process and format the responses data
      const mappedResponses = responsesData.map((item: any) => {
        let formattedResponse = "No answers provided";
        try {
          if (item.answers && typeof item.answers === "string") {
            const answers = JSON.parse(item.answers);
            // Format answers to display without keys
            const answerValues = Object.values(answers);
            if (answerValues.length > 0) {
              formattedResponse = answerValues
                .map((answer) => {
                  if (answer !== undefined && answer !== null) {
                    // Attempt to stringify complex types, otherwise use toString()
                    if (typeof answer === "object") {
                      return JSON.stringify(answer);
                    } else {
                      return answer.toString();
                    }
                  } else {
                    return "N/A";
                  }
                })
                .join(", ");
            } else {
              formattedResponse = "No answers provided";
            }

            // Clean up the formatted response string based on observed patterns
            // Remove leading/trailing quotes and curly braces if present
            formattedResponse = formattedResponse.replace(/^"?{|}"?$/g, "");
            // Remove escaped quotes within the string
            formattedResponse = formattedResponse.replace(/\\"/g, '"');

            // Truncate the response if it's too long
            const maxLength = 100; // Define maximum length for the displayed response
            if (formattedResponse.length > maxLength) {
              formattedResponse =
                formattedResponse.substring(0, maxLength) + "...";
            }
          }
        } catch (error) {
          console.error(
            "Error parsing answers for response:",
            item.answers,
            error
          );
          formattedResponse = "Error parsing response data";
        }

        return {
          ...item,
          response: formattedResponse, // Assign the formatted string to the response property
          applicant: item.applicant, // Ensure applicant object is included
          survey: item.survey, // Ensure survey object is included
          // Include survey_TYPE in the mapped response for easier access
          survey_TYPE: item.survey?.survey_TYPE,
        };
      });

      return mappedResponses; // Return mapped responses
    } catch (error: any) {
      console.error("Error fetching responses:", error);
      notifications.show({
        message: "Failed to load responses",
        color: "red",
      });
      return []; // Return empty array on error
    }
  }, []);

  // Load initial data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Fetch surveys
        const surveysResponse = await authorizedApi.get(
          "/survey/get-all-survey"
        );
        const mappedSurveys: SurveyWithResponseCount[] =
          surveysResponse.data.map((survey: any) => ({
            uuid: survey.id.toString(),
            id: survey.id,
            name: survey.name,
            questions: survey.qns,
            expiry_date: survey.expiry_date,
            survey_status: survey.survey_status,
            created_at: survey.created_at,
            updated_at: survey.updated_at,
            survey_type: survey.survey_TYPE,
            hasSurvey_Started: survey.hasSurvey_Started,
            surveyStartingTime: survey.surveyStartingTime,
            responseCount: 0, // Initialize responseCount
          }));

        // Fetch all responses
        const allResponsesData = await fetchResponses(null); // fetchResponses now returns the mapped data
        setAllResponses(allResponsesData);

        // Calculate response count for each survey from the fetched allResponsesData
        const responseCounts: { [surveyId: number]: number } = {};
        allResponsesData.forEach((response: SurveyResponse) => {
          if (response.survey?.id) {
            responseCounts[response.survey.id] =
              (responseCounts[response.survey.id] || 0) + 1;
          }
        });

        // Update surveys with calculated response counts
        const surveysWithCounts = mappedSurveys.map((survey) => ({
          ...survey,
          responseCount: responseCounts[survey.id] || 0,
        }));
        setSurveys(surveysWithCounts);

        notifications.show({
          message: "Data loaded successfully",
          color: "green",
        });
      } catch (error) {
        console.error("Error loading initial data:", error);
        notifications.show({
          message: "Failed to load initial data",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [fetchResponses]); // Dependency on fetchResponses because it's used inside

  // Calculate overall survey statistics whenever surveys or allResponses change
  useEffect(() => {
    setTotalSurveys(surveys.length);
    setOngoingSurveys(
      surveys.filter((s) => s.survey_status === ESurveyStatus.ONGOING).length
    );
    setEndedSurveys(surveys.filter((s) => s.survey_status === "ENDED").length);
    setTotalResponses(allResponses.length);

    // Determine surveys with and without responses
    const surveysWithAnyResponses = new Set(
      allResponses.map((r) => r.survey?.id)
    );
    setSurveysWithResponses(surveysWithAnyResponses.size);
    // A survey is pending response if it's not in the set of surveys with any responses
    setSurveysPendingResponse(
      surveys.filter((s) => !surveysWithAnyResponses.has(s.id)).length
    );
  }, [surveys, allResponses]); // Keep this effect to update statistics based on surveys and allResponses

  // Handle marking a response as reviewed
  const handleMarkAsReviewed = useCallback(async (responseId: string) => {
    try {
      setIsLoading(true);
      // Add your API call for marking as reviewed
      // await authorizedApi.put(`/survey/responses/${responseId}/mark-reviewed`)

      // Also update all responses state if the reviewed response is present there
      setAllResponses((prevResponses) =>
        prevResponses.map((response) =>
          response.uuid === responseId
            ? { ...response, reviewed: true }
            : response
        )
      );

      notifications.show({
        message: "Response marked as reviewed",
        color: "green",
      });
    } catch (error) {
      console.error("Error marking response as reviewed:", error);
      notifications.show({
        message: "Failed to mark response as reviewed",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle deleting a survey
  const handleDeleteSurvey = useCallback(
    async (surveyId: string) => {
      try {
        setIsLoading(true);
        await authorizedApi.delete(`/survey/remove/${surveyId}`);

        setSurveys((prevSurveys) =>
          prevSurveys.filter((survey) => survey.uuid !== surveyId)
        );

        notifications.show({
          message: "Survey deleted successfully",
          color: "green",
        });

        closeDeleteModal();
        fetchSurveys(); // Refresh the list
      } catch (error) {
        console.error("Error deleting survey:", error);
        notifications.show({
          message: "Failed to delete survey",
          color: "red",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [closeDeleteModal, fetchSurveys]
  );

  // Handle starting a survey
  const handleStartSurvey = useCallback(
    async (surveyId: string) => {
      try {
        setIsLoading(true);
        await authorizedApi.put(`/survey/${surveyId}/start-survey`);

        // Update the survey status locally
        setSurveys((prevSurveys) =>
          prevSurveys.map((survey) =>
            survey.uuid === surveyId
              ? { ...survey, survey_status: ESurveyStatus.ONGOING }
              : survey
          )
        );

        notifications.show({
          message: "Survey started successfully",
          color: "green",
        });

        fetchSurveys(); // Refresh the list to get updated data
      } catch (error) {
        console.error("Error starting survey:", error);
        notifications.show({
          message: "Failed to start survey",
          color: "red",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [fetchSurveys]
  );

  // Handle ending a survey
  const handleEndSurvey = useCallback(
    async (surveyId: string) => {
      try {
        setIsLoading(true);
        await authorizedApi.put(`/survey/${surveyId}/end-survey`);

        setSurveys((prevSurveys) =>
          prevSurveys.map((survey) =>
            survey.uuid === surveyId
              ? { ...survey, survey_status: ESurveyStatus.ENDED }
              : survey
          )
        );

        notifications.show({
          message: "Survey ended successfully",
          color: "green",
        });

        closeEndSurveyModal();
      } catch (error) {
        console.error("Error ending survey:", error);
        notifications.show({
          message: "Failed to end survey",
          color: "red",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [closeEndSurveyModal]
  );

  // Handle downloading responses for a specific survey
  // This function is now intended to be called with a specific surveyId
  const handleDownloadResponses = async (
    surveyId: string | number | undefined | null
  ) => {
    // Add logging to check the received surveyId
    console.log("handleDownloadResponses called with surveyId:", surveyId);

    // Check if a valid surveyId is provided
    if (surveyId === undefined || surveyId === null || surveyId === "") {
      console.error("Download Error: Invalid survey ID provided.", {
        surveyId,
      }); // Log for debugging
      notifications.show({
        title: "Error",
        message: "Could not download responses. Invalid survey selected.", // Clearer error message
        color: "red",
      });
      return;
    }

    try {
      // Use the specific survey download endpoint provided by the user
      const response = await authorizedApi.get(
        `/survey/dowload-responses/${surveyId}`,
        {
          responseType: "blob", // Important for downloading files
        }
      );

      // Create a blob from the response data
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Create a link element and trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // Suggest a filename (you might need to get this from the API response headers if available)
      const contentDisposition = response.headers["content-disposition"];
      // Use a more specific filename based on the survey ID
      let filename = `survey_${surveyId}_responses.xlsx`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      notifications.show({
        message: "Download started successfully",
        color: "green",
      });
    } catch (error: any) {
      console.error("Error downloading responses:", error);
      notifications.show({
        title: "Error",
        message:
          error.response?.data?.message || "Failed to download responses",
        color: "red",
      });
    }
  };

  // formatResponsesForExport is used for the overall Export Excel button
  const formatResponsesForExport = (responses: SurveyResponse[]) => {
    if (responses.length === 0) return [];

    // Assuming all responses have the same survey structure, use the first response's survey to get questions
    const sampleResponse = responses[0];
    let surveyQuestions: any = {};
    try {
      if (
        sampleResponse.survey?.qns &&
        typeof sampleResponse.survey.qns === "string"
      ) {
        surveyQuestions = JSON.parse(sampleResponse.survey.qns);
      }
    } catch (error) {
      console.error("Error parsing survey questions for export:", error);
      notifications.show({
        title: "Warning",
        message: "Could not parse survey question structure for export.",
        color: "yellow",
      });
      return []; // Return empty if questions can't be parsed
    }

    // Extract question titles and IDs to create dynamic headers
    const questionHeaders: { id: string; title: string }[] = [];
    // Assuming surveyQuestions structure has pages and surveys (questions) within them
    if (surveyQuestions && typeof surveyQuestions === "object") {
      Object.values(surveyQuestions).forEach((page: any) => {
        if (page && page.pages && Array.isArray(page.pages)) {
          page.pages.forEach((pageContent: any) => {
            if (
              pageContent &&
              pageContent.surveys &&
              Array.isArray(pageContent.surveys)
            ) {
              pageContent.surveys.forEach((question: any) => {
                if (question.id && question.title) {
                  questionHeaders.push({
                    id: question.id,
                    title: question.title,
                  });
                }
              });
            }
          });
        }
      });
    }

    const headers = [
      "Applicant Name",
      "Survey Name",
      "Timestamp",
      "Status",
      ...questionHeaders.map((q) => q.title), // Add question titles as headers
    ];

    const data = [headers];

    responses.forEach((response) => {
      let parsedAnswers: { [key: string]: any } = {};
      try {
        if (response.answers && typeof response.answers === "string") {
          try {
            parsedAnswers = JSON.parse(response.answers);
          } catch (error) {
            // Try parsing again if double-stringified
            try {
              parsedAnswers = JSON.parse(JSON.parse(response.answers));
            } catch (error2) {
              parsedAnswers = {};
              console.error(
                "Error parsing answers for export (double attempt):",
                response.answers,
                error2
              );
              notifications.show({
                title: "Warning",
                message:
                  "Could not parse answer data for a response during export.",
                color: "yellow",
              });
            }
          }
        }
      } catch (error) {
        parsedAnswers = {};
        console.error(
          "Error parsing answers for export:",
          response.answers,
          error
        );
        notifications.show({
          title: "Warning",
          message: "Could not parse answer data for a response during export.",
          color: "yellow",
        });
      }

      // Build question map for this response
      const questionMap = getQuestionMap(response.survey?.qns);
      const row = [
        response.applicant?.name || "N/A",
        response.survey?.name || "N/A",
        response.submitted_at
          ? format(new Date(response.submitted_at), "MMM dd, yyyy HH:mm")
          : "N/A",
        response.reviewed ? "Reviewed" : "Pending",
        ...questionHeaders.map((q) => {
          const answer = parsedAnswers?.[q.id];
          if (Array.isArray(answer)) {
            return answer.join(", ");
          } else if (answer !== undefined && answer !== null) {
            return answer.toString();
          } else {
            return "N/A";
          }
        }),
      ];
      data.push(row);
    });

    return data;
  };

  // Enhanced filter logic for surveys
  const filteredSurveys = surveys.filter((survey) => {
    // Tab filter
    if (
      activeTab === "ongoing" &&
      survey.survey_status !== ESurveyStatus.ONGOING
    )
      return false;
    if (activeTab === "ended" && survey.survey_status !== "ENDED") return false;
    // Type filter
    if (filterType && filterType !== "all" && survey.survey_type !== filterType)
      return false;
    // Status filter
    if (
      filterStatus &&
      filterStatus !== "all" &&
      survey.survey_status !== filterStatus
    )
      return false;
    // Created date filter
    if (
      filterCreatedFrom &&
      new Date(survey.created_at) < new Date(filterCreatedFrom)
    )
      return false;
    if (
      filterCreatedTo &&
      new Date(survey.created_at) > new Date(filterCreatedTo)
    )
      return false;
    // Expiry date filter
    if (
      filterExpiryFrom &&
      new Date(survey.expiry_date) < new Date(filterExpiryFrom)
    )
      return false;
    if (
      filterExpiryTo &&
      new Date(survey.expiry_date) > new Date(filterExpiryTo)
    )
      return false;
    // Search filter
    return survey.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Enhanced filter logic for responses
  const filteredResponses = allResponses.filter((response) => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    const applicantName = response.applicant?.name?.toLowerCase() || "";
    const surveyName = response.survey?.name?.toLowerCase() || "";
    let answersString = "";
    try {
      if (typeof response.answers === "string") {
        const parsedAnswers = JSON.parse(response.answers);
        if (typeof parsedAnswers === "object" && parsedAnswers !== null) {
          answersString = Object.values(parsedAnswers).join(" ").toLowerCase();
        }
      }
    } catch (error) {
      answersString = "";
    }
    // Type filter
    if (
      filterType &&
      filterType !== "all" &&
      response.survey?.survey_TYPE !== filterType
    )
      return false;
    // Status filter
    if (
      filterStatus &&
      filterStatus !== "all" &&
      response.survey?.survey_status !== filterStatus
    )
      return false;
    // Created date filter
    if (
      filterCreatedFrom &&
      new Date(response.survey?.created_at) < new Date(filterCreatedFrom)
    )
      return false;
    if (
      filterCreatedTo &&
      new Date(response.survey?.created_at) > new Date(filterCreatedTo)
    )
      return false;
    // Expiry date filter
    if (
      filterExpiryFrom &&
      new Date(response.survey?.expiry_date) < new Date(filterExpiryFrom)
    )
      return false;
    if (
      filterExpiryTo &&
      new Date(response.survey?.expiry_date) > new Date(filterExpiryTo)
    )
      return false;
    // Search filter
    return (
      applicantName.includes(lowerSearchQuery) ||
      surveyName.includes(lowerSearchQuery) ||
      answersString.includes(lowerSearchQuery)
    );
  });

  // Table columns definition
  const columns: ColumnDef<Survey>[] = [
    {
      accessorKey: "name",
      header: "Survey Name",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "survey_type",
      header: "Type",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.getValue("survey_type")}
        </div>
      ),
    },
    {
      accessorKey: "survey_status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("survey_status") as string;
        const hasSurveyStarted = row.original.hasSurvey_Started;

        let statusText = status;
        let statusColor = "bg-gray-100 text-gray-800";

        if (status === ESurveyStatus.DRAFT) {
          statusColor = "bg-yellow-100 text-yellow-800";
          statusText = "Draft";
        } else if (status === ESurveyStatus.ONGOING) {
          statusColor = "bg-green-100 text-green-800";
          statusText = hasSurveyStarted ? "Active" : "Published";
        } else if (status === "ENDED") {
          statusColor = "bg-red-100 text-red-800";
          statusText = "Ended";
        }

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
          >
            {statusText}
          </span>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return (
          <div className="text-sm text-gray-600">
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: "expiry_date",
      header: "Expires",
      cell: ({ row }) => {
        const expiryDate = row.getValue("expiry_date") as string;
        const date = new Date(expiryDate);
        const isExpired = date < new Date();

        return (
          <div
            className={`text-sm ${isExpired ? "text-red-600" : "text-gray-600"}`}
          >
            {date.toLocaleDateString()}
            {isExpired && (
              <span className="ml-1 text-xs text-red-500">(Expired)</span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const survey = row.original;
        const canEnd = survey.survey_status === ESurveyStatus.ONGOING;
        const canEdit = survey.survey_status === ESurveyStatus.DRAFT;
        const canStart = survey.survey_status === ESurveyStatus.DRAFT;

        return (
          <div className="flex justify-end">
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <HiDotsHorizontal className="h-4 w-4" />
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
                    window.location.href = `/admin/surveys/view/${survey.id}`;
                  }}
                >
                  View Details
                </Menu.Item>

                {canEdit && (
                  <Menu.Item
                    leftSection={<CiEdit className="h-4 w-4" />}
                    onClick={() =>
                      (window.location.href = `/admin/surveys/create-edit/${survey.id}`)
                    }
                  >
                    Edit Survey
                  </Menu.Item>
                )}

                {canStart && (
                  <Menu.Item
                    leftSection={<FiPlay className="h-4 w-4" />}
                    onClick={() => {
                      handleStartSurvey(survey.uuid);
                    }}
                  >
                    Start Survey
                  </Menu.Item>
                )}

                {canEnd && (
                  <Menu.Item
                    leftSection={<MdStop className="h-4 w-4" />}
                    onClick={() => {
                      setSelectedSurvey(survey);
                      openEndSurveyModal();
                    }}
                  >
                    End Survey
                  </Menu.Item>
                )}

                <Menu.Divider />

                {/* Only show Delete for DRAFT surveys to prevent data loss */}
                {survey.survey_status === ESurveyStatus.DRAFT && (
                  <Menu.Item
                    color="red"
                    leftSection={<RiDeleteBinLine className="h-4 w-4" />}
                    onClick={() => {
                      setSelectedSurvey(survey);
                      openDeleteModal();
                    }}
                  >
                    Delete Survey
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          </div>
        );
      },
    },
  ];

  // Column definitions for Responses table
  const responseColumns: ColumnDef<SurveyResponse>[] = [
    {
      accessorKey: "applicant",
      header: () => <div className="text-left font-semibold">Applicant</div>,
      cell: ({ row }) => (
        <div className="font-medium">{row.original.applicant.name}</div>
      ),
    },
    {
      accessorKey: "survey",
      header: () => <div className="text-left font-semibold">Survey</div>,
      cell: ({ row }) => <div>{row.original.survey.name}</div>,
    },
    {
      accessorKey: "submitted_at",
      header: () => <div className="text-left font-semibold">Timestamp</div>,
      cell: ({ row }) => (
        <div>
          {format(new Date(row.original.submitted_at), "MMM dd, yyyy HH:mm")}
        </div>
      ),
    },
    {
      accessorKey: "response",
      header: () => <div className="text-left font-semibold">Response</div>,
      cell: ({ row }) => {
        const questionMap = getQuestionMap(row.original.survey?.qns);
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
                  // Navigate to the details page
                  window.location.href = `/admin/surveys/responses/${row.original.survey.id}/${row.original.applicant.uuid}`;
                }}
              >
                View Details
              </Menu.Item>
              {!row.original.reviewed && (
                <Menu.Item>
                  <div
                    className="w-full py-2 flex text-base items-center gap-3 text-[#576074] cursor-pointer"
                    onClick={() => handleMarkAsReviewed(row.original.uuid)}
                  >
                    <CiEdit size={18} color="#576074" />
                    Mark as Reviewed
                  </div>
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </div>
      ),
    },
  ];

  // New columns for Responses per Survey Type
  const responsesPerTypeColumns: ColumnDef<SurveyWithResponseCount>[] = [
    {
      accessorKey: "name",
      header: "Survey Name",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "survey_type",
      header: "Type",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.getValue("survey_type")}
        </div>
      ),
    },
    {
      accessorKey: "survey_status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("survey_status") as string;
        const hasSurveyStarted = row.original.hasSurvey_Started;

        let statusText = status;
        let statusColor = "bg-gray-100 text-gray-800";

        if (status === ESurveyStatus.DRAFT) {
          statusColor = "bg-yellow-100 text-yellow-800";
          statusText = "Draft";
        } else if (status === ESurveyStatus.ONGOING) {
          statusColor = "bg-green-100 text-green-800";
          statusText = hasSurveyStarted ? "Active" : "Published";
        } else if (status === "ENDED") {
          statusColor = "bg-red-100 text-red-800";
          statusText = "Ended";
        }

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
          >
            {statusText}
          </span>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return (
          <div className="text-sm text-gray-600">
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: "expiry_date",
      header: "Expires",
      cell: ({ row }) => {
        const expiryDate = row.getValue("expiry_date") as string;
        const date = new Date(expiryDate);
        const isExpired = date < new Date();

        return (
          <div
            className={`text-sm ${isExpired ? "text-red-600" : "text-gray-600"}`}
          >
            {date.toLocaleDateString()}
            {isExpired && (
              <span className="ml-1 text-xs text-red-500">(Expired)</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "responseCount",
      header: "Response Count",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.original.responseCount}
        </div>
      ),
    },
    {
      id: "download", // Unique ID for the column
      header: () => (
        <div className="text-center font-semibold">
          Download responses per survey
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => {
              // Explicitly pass the survey ID from the row data
              handleDownloadResponses(row.original.id);
            }}
            // Add a title for accessibility
            title={`Download  responses for ${row.original.name}`}
          >
            {/* Use the download icon */}
            <FiDownload className="h-4 w-4 text-blue-600" />
          </button>
        </div>
      ),
    },
    {
      id: "actions",
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
                  // Navigate to the responses for this survey
                  window.location.href = `/admin/surveys/responses?surveyId=${row.original.uuid}`;
                }}
              >
                View Responses
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Surveys Overview
      </h1>

      {/* New Survey Button */}
      <div className="flex justify-end mb-6">
        <Link
          href="/admin/surveys/create-edit/create"
          className="text-white py-2.5 px-6 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap"
          style={{
            background:
              "linear-gradient(84.73deg, #005DE9 10.01%, #0546A8 114.53%)",
          }}
        >
          <span className="text-xl">
            <SolarAddFolderBold />
          </span>
          <span className="text-base font-medium">New Survey</span>
        </Link>
      </div>

      {/* Survey Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {/* Total Surveys Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Surveys
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalSurveys}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ongoing Surveys Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Ongoing Surveys
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {ongoingSurveys}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ended Surveys Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                <CheckCheck className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Ended Surveys
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {endedSurveys}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Responses Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
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

        {/* Surveys with Responses Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Surveys with Responses
                </p>
                <p className="text-2xl font-bold text-teal-600">
                  {surveysWithResponses}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Surveys Pending Response Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Surveys Pending Response
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {surveysPendingResponse}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10 shadow-sm">
        <div className="w-full p-5 border-b overflow-x-auto">
          <div className="flex space-x-4 md:space-x-8 min-w-max">
            <button
              className={`text-base md:text-lg font-medium pb-2 ${
                activeTab === "all"
                  ? "text-[#005DE9] border-b-2 border-[#005DE9]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => {
                setActiveTab("all");
                setSelectedSurvey(null);
                setSearchQuery("");
              }}
            >
              All Surveys
            </button>
            <button
              className={`text-base md:text-lg font-medium pb-2 ${
                activeTab === "ongoing"
                  ? "text-[#005DE9] border-b-2 border-[#005DE9]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => {
                setActiveTab("ongoing");
                setSelectedSurvey(null);
                setSearchQuery("");
              }}
            >
              Ongoing
            </button>
            <button
              className={`text-base md:text-lg font-medium pb-2 ${
                activeTab === "ended"
                  ? "text-[#005DE9] border-b-2 border-[#005DE9]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => {
                setActiveTab("ended");
                setSelectedSurvey(null);
                setSearchQuery("");
              }}
            >
              Ended
            </button>
            <button
              className={`text-base md:text-lg font-medium pb-2 ${
                activeTab === "responsesPerType"
                  ? "text-[#005DE9] border-b-2 border-[#005DE9]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => {
                setActiveTab("responsesPerType");
                setSelectedSurvey(null);
                setSearchQuery("");
              }}
            >
              Responses per Survey Type
            </button>
          </div>
        </div>

        {/* Enhanced Filter Section */}
        <div className="w-full p-4 sm:p-5 border-b bg-gray-50/50">
          <div className="flex flex-col space-y-4">
            {/* Filter Header */}
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </div>

            {/* Filter Controls - Using Flexbox for better control */}
            <div className="flex flex-wrap gap-4">
              {/* Type Filter */}
              <div className="flex flex-col space-y-1 min-w-[160px] flex-1 max-w-[200px]">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Survey Type
                </label>
                <Select
                  value={filterType}
                  onValueChange={setFilterType}
                  placeholder="All Types"
                  className="w-full"
                >
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="TRAINEESURVEY">Trainee Survey</SelectItem>
                  <SelectItem value="COMPANYSURVEY">Company Survey</SelectItem>
                  <SelectItem value="GENERALSURVEY">General Survey</SelectItem>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="flex flex-col space-y-1 min-w-[160px] flex-1 max-w-[350px]">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Status
                </label>
                <Select
                  value={filterStatus}
                  onValueChange={setFilterStatus}
                  placeholder="All statuses"
                  className="w-full"
                >
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ONGOING">Ongoing</SelectItem>
                  <SelectItem value="ENDED">Ended</SelectItem>
                </Select>
              </div>

              {/* Created Date Range */}
              <div className="flex flex-col space-y-1 min-w-[200px] flex-1 max-w-[280px]">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Created Date
                </label>
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="date"
                    value={filterCreatedFrom}
                    onChange={(e) => setFilterCreatedFrom(e.target.value)}
                    className="flex-1 min-w-0 px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="From"
                  />
                  <span className="text-xs text-gray-400 px-1">to</span>
                  <input
                    type="date"
                    value={filterCreatedTo}
                    onChange={(e) => setFilterCreatedTo(e.target.value)}
                    className="flex-1 min-w-0 px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="To"
                  />
                </div>
              </div>

              {/* Expiry Date Range */}
              <div className="flex flex-col space-y-1 min-w-[200px] flex-1 max-w-[280px]">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Expiry Date
                </label>
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="date"
                    value={filterExpiryFrom}
                    onChange={(e) => setFilterExpiryFrom(e.target.value)}
                    className="flex-1 min-w-0 px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="From"
                  />
                  <span className="text-xs text-gray-400 px-1">to</span>
                  <input
                    type="date"
                    value={filterExpiryTo}
                    onChange={(e) => setFilterExpiryTo(e.target.value)}
                    className="flex-1 min-w-0 px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="To"
                  />
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="flex flex-col justify-end min-w-[120px]">
                <button
                  onClick={() => {
                    setFilterType("");
                    setFilterStatus("");
                    setFilterCreatedFrom("");
                    setFilterCreatedTo("");
                    setFilterExpiryFrom("");
                    setFilterExpiryTo("");
                  }}
                  className="px-4 py-2 text-sm text-white bg-blue-500 border border-gray-300 rounded-md hover:bg-blue-600  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors whitespace-nowrap"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions Section */}
        <div className="w-full flex flex-col lg:flex-row lg:justify-between lg:items-center p-4 sm:p-5 gap-4">
          {/* Search Input */}
          <div className="relative w-full lg:w-[25rem]">
            <span className="absolute top-4 left-3">
              <BiSearch size={22} className="text-gray-500" />
            </span>
            <input
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 py-4 pl-10 text-base text-black placeholder:text-gray-500 rounded-full bg-[#005DE908] border-none outline-none focus:ring-2 focus:ring-blue-100"
              placeholder={`Search ${
                activeTab === "responsesPerType"
                  ? "surveys"
                  : activeTab === "ongoing"
                    ? "ongoing surveys"
                    : activeTab === "ended"
                      ? "ended surveys"
                      : "surveys"
              }...`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 self-end lg:self-auto">
            {activeTab === "responsesPerType" && selectedSurvey && (
              <button
                onClick={() => {
                  setSelectedSurvey(null);
                  setSearchQuery("");
                }}
                className="text-[#005DE9] py-2.5 px-6 rounded-full border border-[#005DE9] hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                View All Responses
              </button>
            )}

            {activeTab === "responsesPerType" && !selectedSurvey && (
              <ExportExcel
                excelData={formatResponsesForExport(filteredResponses)}
                fileName="survey_responses"
              />
            )}
          </div>
        </div>

        <div className="w-full px-4 sm:px-5 overflow-x-auto">
          {activeTab === "responsesPerType" ? (
            <CustomDataTable
              columns={responsesPerTypeColumns}
              data={filteredSurveys}
              loading={loading}
              noDataMessage={
                searchQuery
                  ? `No surveys found related to "${searchQuery}"`
                  : "No surveys available"
              }
              loadingBackgroundColor="#f1f5f9"
              loadingColor="#005DE9"
              pageSize={6}
            />
          ) : (
            <CustomDataTable
              columns={columns}
              data={filteredSurveys}
              loading={loading}
              noDataMessage={
                searchQuery
                  ? `No surveys found related to "${searchQuery}"`
                  : activeTab === "ongoing"
                    ? "No ongoing surveys found"
                    : activeTab === "ended"
                      ? "No ended surveys found"
                      : "No surveys added so far"
              }
              loadingBackgroundColor="#f1f5f9"
              loadingColor="#005DE9"
              pageSize={6}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <EndSurveyModal
        isOpenModal={isOpenEndSurvey}
        closeModal={() => {
          closeEndSurveyModal();
          setSelectedSurvey(null);
          fetchSurveys();
        }}
        survey={selectedSurvey}
      />

      <DeleteModal
        isOpenModal={isOpenDelete}
        closeModal={() => {
          closeDeleteModal();
          setSelectedSurvey(null);
          fetchSurveys();
        }}
        type="surveys"
        id={selectedSurvey?.id?.toString() ?? ""}
      />
    </div>
  );
};

export default SurveyPage;
