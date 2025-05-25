"use client";

import { useState, useCallback, useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import { SolarAddFolderBold } from "@/components/core/icons";
import type { ColumnDef } from "@tanstack/react-table";
import { CustomDataTable } from "@/components/core/data-table/custom-data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { useDisclosure } from "@mantine/hooks";
import { Menu } from "@mantine/core";
import { FiEye } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import Link from "next/link";
import DeleteModal from "@/components/Modals/DeleteModal";
import EndSurveyModal from "@/components/survey/EndSurveyModal";
import { format } from "date-fns";
import type { Survey, SurveyResponse } from "./types";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { ESurveyStatus } from "@/types/surveys-form";

const SurveyPage = () => {
  const [activeTab, setActiveTab] = useState<
    "all" | "ongoing" | "ended" | "responses"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);

  // State for surveys and responses
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [
    isOpenEndSurvey,
    { open: openEndSurveyModal, close: closeEndSurveyModal },
  ] = useDisclosure(false);
  const [isOpenDelete, { open: openDeleteModal, close: closeDeleteModal }] =
    useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);

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
  const fetchResponses = useCallback(async () => {
    try {
      // Add your API endpoint for responses here
      // const response = await authorizedApi.get("/survey/get-responses")
      // setResponses(response.data)
      setResponses([]); // For now, until you provide the responses API
    } catch (error) {
      console.error("Error fetching responses:", error);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    fetchSurveys();
    fetchResponses();
  }, [fetchSurveys, fetchResponses]);

  // Handle marking a response as reviewed
  const handleMarkAsReviewed = useCallback(async (responseId: string) => {
    try {
      setIsLoading(true);
      // Add your API call for marking as reviewed
      // await authorizedApi.put(`/survey/responses/${responseId}/mark-reviewed`)

      setResponses((prevResponses) =>
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

  // Handle starting a survey
  const handleStartSurvey = useCallback(async (surveyId: string) => {
    try {
      setIsLoading(true);
      await authorizedApi.put(`/survey/start/${surveyId}`);

      setSurveys((prevSurveys) =>
        prevSurveys.map((survey) =>
          survey.uuid === surveyId ? { ...survey, status: "ongoing" } : survey
        )
      );

      notifications.show({
        message: "Survey started successfully",
        color: "green",
      });
    } catch (error) {
      console.error("Error starting survey:", error);
      notifications.show({
        message: "Failed to start survey",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle ending a survey
  const handleEndSurvey = useCallback(
    async (surveyId: string) => {
      try {
        setIsLoading(true);
        await authorizedApi.put(`/survey/end/${surveyId}`);

        setSurveys((prevSurveys) =>
          prevSurveys.map((survey) =>
            survey.uuid === surveyId ? { ...survey, status: "ended" } : survey
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

  // Filter data based on search query
  const filteredSurveys = surveys.filter((survey) => {
    // First filter by tab selection
    if (activeTab === "ongoing" && survey.status !== "ongoing") return false;
    if (activeTab === "ended" && survey.status !== "ended") return false;

    // Then filter by search query
    return survey.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredResponses = responses.filter((response) => {
    if (selectedSurvey) {
      return (
        response.survey_id === selectedSurvey.uuid &&
        (response.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
          response.response.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return (
      response.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.survey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.response.toLowerCase().includes(searchQuery.toLowerCase())
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
        } else if (status === ESurveyStatus.EXPIRED) {
          statusColor = "bg-red-100 text-red-800";
          statusText = "Expired";
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

        return (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <button className="p-1 hover:bg-gray-100 rounded">
                <HiDotsHorizontal className="h-4 w-4" />
              </button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<FiEye className="h-4 w-4" />}
                onClick={() =>
                  (window.location.href = `/admin/surveys/create-edit/${survey.id}`)
                }
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

              {canEnd && (
                <Menu.Item
                  leftSection={<BiSearch className="h-4 w-4" />}
                  onClick={() => {
                    setSelectedSurvey(survey);
                    openEndSurveyModal();
                  }}
                >
                  End Survey
                </Menu.Item>
              )}

              <Menu.Divider />

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
            </Menu.Dropdown>
          </Menu>
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
        <div className="font-medium">{row.original.applicant}</div>
      ),
    },
    {
      accessorKey: "survey",
      header: () => <div className="text-left font-semibold">Survey</div>,
      cell: ({ row }) => <div>{row.original.survey}</div>,
    },
    {
      accessorKey: "timestamp",
      header: () => <div className="text-left font-semibold">Timestamp</div>,
      cell: ({ row }) => (
        <div>{format(row.original.timestamp, "MMM dd, yyyy HH:mm")}</div>
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
          className={`px-3 py-1 rounded-full text-sm w-fit ${
            row.original.reviewed
              ? "bg-green-100 text-green-800"
              : "bg-amber-100 text-amber-800"
          }`}
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
                    "linear-gradient(84.73deg, #005DE9 10.01%, #0546A8 114.53%)",
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
              <Menu.Item>
                <Link
                  href={`/admin/surveys/responses/${row.original.uuid}`}
                  className="w-full py-2 flex text-base items-center gap-3 text-[#576074]"
                >
                  <FiEye size={18} color="#576074" />
                  View Details
                </Link>
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

  return (
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
              activeTab === "responses"
                ? "text-[#005DE9] border-b-2 border-[#005DE9]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("responses")}
          >
            Responses
            {selectedSurvey && activeTab === "responses" && (
              <span className="ml-2 text-sm font-normal hidden sm:inline">
                ({selectedSurvey.name})
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col lg:flex-row lg:justify-between lg:items-center p-4 sm:p-5 gap-4">
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
              activeTab === "responses"
                ? "responses"
                : activeTab === "ongoing"
                  ? "ongoing surveys"
                  : activeTab === "ended"
                    ? "ended surveys"
                    : "surveys"
            }...`}
          />
        </div>

        <div className="flex items-center gap-3 self-end lg:self-auto">
          {activeTab === "responses" && selectedSurvey && (
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

          {(activeTab === "all" ||
            activeTab === "ongoing" ||
            activeTab === "ended") && (
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
          )}
        </div>
      </div>

      <div className="w-full px-4 sm:px-5 overflow-x-auto">
        {activeTab === "responses" ? (
          <CustomDataTable
            columns={responseColumns}
            data={filteredResponses}
            loading={loading}
            noDataMessage={
              selectedSurvey
                ? `No responses found for "${selectedSurvey.name}"`
                : searchQuery
                  ? `No responses found related to "${searchQuery}"`
                  : "No responses available"
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
