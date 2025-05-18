"use client"

import { useState, useCallback } from "react"
import { BiSearch } from "react-icons/bi"
import { SolarAddFolderBold } from "@/components/core/icons"
import type { ColumnDef } from "@tanstack/react-table"
import { CustomDataTable } from "@/components/core/data-table/custom-data-table";
import { HiDotsHorizontal } from "react-icons/hi"
import { useDisclosure } from "@mantine/hooks"
import { Menu } from "@mantine/core"
import { FiEye } from "react-icons/fi"
import { CiEdit } from "react-icons/ci"
import { RiDeleteBinLine } from "react-icons/ri"
import Link from "next/link"
import DeleteModal from "@/components/Modals/DeleteModal"
import EndSurveyModal from "@/components/survey/EndSurveyModal"
import { format } from "date-fns"
import type { Survey, SurveyResponse } from "./types"

const SurveyPage = () => {
  const [activeTab, setActiveTab] = useState<"surveys" | "responses">("surveys")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null)

  // State for surveys and responses
  const [surveys, setSurveys] = useState<Survey[]>([
    {
      uuid: "s1",
      name: "Customer Satisfaction Survey",
      applicants: 124,
      status: "ongoing",
      created_at: new Date("2023-04-15"),
      expiry_date: new Date("2023-06-15"),
    },
    {
      uuid: "s2",
      name: "Employee Feedback Form",
      applicants: 45,
      status: "ongoing",
      created_at: new Date("2023-05-01"),
      expiry_date: new Date("2023-07-01"),
    },
    {
      uuid: "s3",
      name: "Product Evaluation Survey",
      applicants: 78,
      status: "expired",
      created_at: new Date("2023-02-10"),
      expiry_date: new Date("2023-04-10"),
    },
    {
      uuid: "s4",
      name: "Website Usability Survey",
      applicants: 92,
      status: "ongoing",
      created_at: new Date("2023-03-20"),
      expiry_date: new Date("2023-05-20"),
    },
    {
      uuid: "s5",
      name: "Market Research Survey",
      applicants: 156,
      status: "ongoing",
      created_at: new Date("2023-04-05"),
      expiry_date: new Date("2023-06-05"),
    },
    {
      uuid: "s6",
      name: "Post-Purchase Feedback",
      applicants: 67,
      status: "expired",
      created_at: new Date("2023-01-15"),
      expiry_date: new Date("2023-03-15"),
    },
    {
      uuid: "s7",
      name: "Training Effectiveness Survey",
      applicants: 34,
      status: "ongoing",
      created_at: new Date("2023-04-25"),
      expiry_date: new Date("2023-06-25"),
    },
  ])

  const [responses, setResponses] = useState<SurveyResponse[]>([
    {
      uuid: "r1",
      applicant: "John Doe",
      survey: "Customer Satisfaction Survey",
      survey_id: "s1",
      timestamp: new Date("2023-05-10T14:30:00"),
      response: "Very satisfied with the service. Would recommend to others.",
      reviewed: true,
    },
    {
      uuid: "r2",
      applicant: "Jane Smith",
      survey: "Customer Satisfaction Survey",
      survey_id: "s1",
      timestamp: new Date("2023-05-11T09:15:00"),
      response: "Good experience overall, but could improve response time.",
      reviewed: false,
    },
    {
      uuid: "r3",
      applicant: "Michael Johnson",
      survey: "Employee Feedback Form",
      survey_id: "s2",
      timestamp: new Date("2023-05-05T16:45:00"),
      response: "The work environment is great, but we need better equipment.",
      reviewed: false,
    },
    {
      uuid: "r4",
      applicant: "Sarah Williams",
      survey: "Product Evaluation Survey",
      survey_id: "s3",
      timestamp: new Date("2023-04-02T10:30:00"),
      response: "The product meets most of my needs but has some usability issues.",
      reviewed: true,
    },
    {
      uuid: "r5",
      applicant: "Robert Brown",
      survey: "Website Usability Survey",
      survey_id: "s4",
      timestamp: new Date("2023-04-15T13:20:00"),
      response: "Navigation is intuitive, but the checkout process is confusing.",
      reviewed: false,
    },
    {
      uuid: "r6",
      applicant: "Emily Davis",
      survey: "Market Research Survey",
      survey_id: "s5",
      timestamp: new Date("2023-04-20T11:45:00"),
      response: "I prefer products with eco-friendly packaging and sustainable materials.",
      reviewed: true,
    },
    {
      uuid: "r7",
      applicant: "David Wilson",
      survey: "Post-Purchase Feedback",
      survey_id: "s6",
      timestamp: new Date("2023-02-28T09:10:00"),
      response: "Delivery was prompt and the product quality exceeded my expectations.",
      reviewed: false,
    },
  ])

  // Modal controls
  const [isOpenEndSurvey, { open: openEndSurveyModal, close: closeEndSurveyModal }] = useDisclosure(false)
  const [isOpenDelete, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false)
  const [isLoading, setIsLoading] = useState(false)

  // Handle marking a response as reviewed
  const handleMarkAsReviewed = useCallback(async (responseId: string) => {
    try {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Update the responses state
      setResponses((prevResponses) =>
        prevResponses.map((response) => (response.uuid === responseId ? { ...response, reviewed: true } : response)),
      )
    } catch (error) {
      console.error("Error marking response as reviewed:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Filter data based on search query
  const filteredSurveys = surveys.filter((survey) => survey.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredResponses = responses.filter((response) => {
    if (selectedSurvey) {
      return (
        response.survey_id === selectedSurvey.uuid &&
        (response.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
          response.response.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    return (
      response.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.survey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.response.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Column definitions for Surveys table
  const surveyColumns: ColumnDef<Survey>[] = [
    {
      accessorKey: "name",
      header: () => <div className="text-left font-semibold">Survey Name</div>,
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "applicants",
      header: () => <div className="text-center font-semibold">Applicants</div>,
      cell: ({ row }) => <div className="text-center">{row.original.applicants}</div>,
    },
    {
      accessorKey: "status",
      header: () => <div className="text-left font-semibold">Status</div>,
      cell: ({ row }) => (
        <div
          className={`px-4 py-1.5 rounded-full text-center w-fit ${
            row.original.status === "ongoing" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: () => <div className="text-left font-semibold">Created At</div>,
      cell: ({ row }) => <div>{format(row.original.created_at, "MMM dd, yyyy")}</div>,
    },
    {
      accessorKey: "expiry_date",
      header: () => <div className="text-left font-semibold">Expiry Date</div>,
      cell: ({ row }) => <div>{format(row.original.expiry_date, "MMM dd, yyyy")}</div>,
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-right font-semibold">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end space-x-3">
          {row.original.status === "ongoing" && (
            <button
              onClick={() => {
                setSelectedSurvey(row.original)
                openEndSurveyModal()
              }}
              className="px-4 py-2 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors"
            >
              End Survey
            </button>
          )}
          <button
            onClick={() => {
              setSelectedSurvey(row.original)
              setActiveTab("responses")
            }}
            className="px-4 py-2 text-sm font-medium rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
          >
            View Responses
          </button>
          <Menu shadow="lg" width={300} position="bottom-end">
            <Menu.Target>
              <button
                style={{
                  background: "linear-gradient(84.73deg, #005DE9 10.01%, #0546A8 114.53%)",
                }}
                className="p-2.5 rounded-full text-white hover:opacity-90 transition-opacity"
              >
                <HiDotsHorizontal size={20} color="white" />
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>
                <h1 className="text-lg font-medium">Actions</h1>
              </Menu.Label>
              <Menu.Divider />
              <Menu.Item>
                <Link
                  href={`/admin/surveys/view/${row.original.uuid}`}
                  className="w-full py-2 flex text-base items-center gap-3 text-[#576074]"
                >
                  <FiEye size={18} color="#576074" />
                  View Details
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link
                  href={`/admin/surveys/edit/${row.original.uuid}`}
                  className="w-full py-2 flex text-base items-center gap-3 text-[#576074]"
                >
                  <CiEdit size={18} color="#576074" />
                  Edit Survey
                </Link>
              </Menu.Item>
              <Menu.Item>
                <div
                  className="w-full py-2 flex text-base items-center gap-3 text-[#576074] cursor-pointer"
                  onClick={() => {
                    setSelectedSurvey(row.original)
                    openDeleteModal()
                  }}
                >
                  <RiDeleteBinLine size={18} color="#576074" />
                  Remove Survey
                </div>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      ),
    },
  ]

  // Column definitions for Responses table
  const responseColumns: ColumnDef<SurveyResponse>[] = [
    {
      accessorKey: "applicant",
      header: () => <div className="text-left font-semibold">Applicant</div>,
      cell: ({ row }) => <div className="font-medium">{row.original.applicant}</div>,
    },
    {
      accessorKey: "survey",
      header: () => <div className="text-left font-semibold">Survey</div>,
      cell: ({ row }) => <div>{row.original.survey}</div>,
    },
    {
      accessorKey: "timestamp",
      header: () => <div className="text-left font-semibold">Timestamp</div>,
      cell: ({ row }) => <div>{format(row.original.timestamp, "MMM dd, yyyy HH:mm")}</div>,
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
          className={`px-4 py-1.5 rounded-full text-center w-fit ${
            row.original.reviewed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.original.reviewed ? "Reviewed" : "Not Reviewed"}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-right font-semibold">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end space-x-3">
          {!row.original.reviewed && (
            <button
              onClick={() => handleMarkAsReviewed(row.original.uuid)}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Mark as Reviewed"}
            </button>
          )}
          <Menu shadow="lg" width={300} position="bottom-end">
            <Menu.Target>
              <button
                style={{
                  background: "linear-gradient(84.73deg, #005DE9 10.01%, #0546A8 114.53%)",
                }}
                className="p-2.5 rounded-full text-white hover:opacity-90 transition-opacity"
              >
                <HiDotsHorizontal size={20} color="white" />
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
  ]

  return (
    <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10 shadow-sm">
      <div className="w-full p-5 border-b">
        <div className="flex space-x-8">
          <button
            className={`text-lg font-medium pb-2 ${
              activeTab === "surveys"
                ? "text-[#005DE9] border-b-2 border-[#005DE9]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("surveys")
              setSelectedSurvey(null)
              setSearchQuery("")
            }}
          >
            Surveys
          </button>
          <button
            className={`text-lg font-medium pb-2 ${
              activeTab === "responses"
                ? "text-[#005DE9] border-b-2 border-[#005DE9]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("responses")}
          >
            Responses
            {selectedSurvey && activeTab === "responses" && (
              <span className="ml-2 text-sm font-normal">({selectedSurvey.name})</span>
            )}
          </button>
        </div>
      </div>

      <div className="w-full lg:flex justify-between items-center p-5">
        <div className="relative lg:w-[25rem] w-full mb-4 lg:mb-0">
          <span className="absolute top-4 left-3">
            <BiSearch size={22} className="text-gray-500" />
          </span>
          <input
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 py-4 pl-10 text-base text-black placeholder:text-gray-500 rounded-full bg-[#005DE908] border-none outline-none focus:ring-2 focus:ring-blue-100"
            placeholder={`Search ${activeTab === "surveys" ? "surveys" : "responses"}...`}
          />
        </div>

        <div className="flex items-center space-x-3">
          {activeTab === "responses" && selectedSurvey && (
            <button
              onClick={() => {
                setSelectedSurvey(null)
                setSearchQuery("")
              }}
              className="text-[#005DE9] py-2.5 px-6 rounded-full border border-[#005DE9] hover:bg-blue-50 transition-colors"
            >
              View All Responses
            </button>
          )}

          {activeTab === "surveys" && (
            <Link
              href="/admin/surveys/create"
              className="text-white py-2.5 px-6 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(84.73deg, #005DE9 10.01%, #0546A8 114.53%)",
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

      <div className="w-full px-5">
        {activeTab === "surveys" ? (
          <CustomDataTable
            columns={surveyColumns}
            data={filteredSurveys}
            loading={false}
            noDataMessage={searchQuery ? `No surveys found related to "${searchQuery}"` : "No surveys added so far"}
            loadingBackgroundColor="#f1f5f9"
            loadingColor="#005DE9"
            pageSize={6}
            
          />
        ) : (
          <CustomDataTable
            columns={responseColumns}
            data={filteredResponses}
            loading={false}
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
        )}
      </div>

      {/* Modals */}
      <EndSurveyModal
        isOpenModal={isOpenEndSurvey}
        closeModal={() => {
          closeEndSurveyModal()
          setSelectedSurvey(null)
        }}
        survey={selectedSurvey}
      />

      {/* Now using "surveys" as the type */}
      <DeleteModal
        isOpenModal={isOpenDelete}
        closeModal={() => {
          closeDeleteModal()
          setSelectedSurvey(null)
        }}
        type="surveys"
        id={selectedSurvey?.uuid ?? ""}
      />
    </div>
  )
}

export default SurveyPage
