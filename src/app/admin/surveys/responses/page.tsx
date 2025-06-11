"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BiSearch } from "react-icons/bi";
import { HiDotsHorizontal } from "react-icons/hi";
import { FiEye } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { Menu } from "@mantine/core";
import { format } from "date-fns";
import { CustomDataTable } from "@/components/core/data-table/custom-data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { Card, CardContent } from "@/components/ui/Card";
import { FileText, User, Filter, Calendar } from "lucide-react";
import { Select, SelectItem } from "@/components/ui/Select";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";

interface SurveyResponse {
  uuid: string;
  applicant: {
    uuid: string;
    name: string;
  };
  survey: {
    id: string;
    name: string;
    qns: string;
  };
  answers: string;
  submitted_at: string;
  reviewed: boolean;
}

const SurveyResponsesPage = () => {
  const searchParams = useSearchParams();
  const surveyId = searchParams.get("surveyId");

  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");

  // Statistics
  const [totalResponses, setTotalResponses] = useState(0);
  const [reviewedResponses, setReviewedResponses] = useState(0);
  const [pendingResponses, setPendingResponses] = useState(0);

  useEffect(() => {
    const fetchResponses = async () => {
      if (!surveyId) return;

      try {
        setLoading(true);
        const response = await authorizedApi.get(
          `/survey/getSurveyResponses/${surveyId}`
        );

        // Process the responses data
        const processedResponses = response.data.map((item: any) => ({
          uuid: item.id,
          applicant: {
            uuid: item.applicant.id,
            name: item.applicant.name,
          },
          survey: {
            id: item.survey.id,
            name: item.survey.name,
            qns: item.survey.qns,
          },
          answers: item.answers,
          submitted_at: item.submitted_at,
          reviewed: item.reviewed || false,
        }));

        setResponses(processedResponses);
      } catch (error) {
        console.error("Error fetching responses:", error);
        notifications.show({
          message: "Failed to load survey responses",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [surveyId]);

  // Update statistics whenever responses change
  useEffect(() => {
    setTotalResponses(responses.length);
    setReviewedResponses(responses.filter((r) => r.reviewed).length);
    setPendingResponses(responses.filter((r) => !r.reviewed).length);
  }, [responses]);

  // Handle marking a response as reviewed
  const handleMarkAsReviewed = async (responseId: string) => {
    try {
      await authorizedApi.put(
        `/survey/survey-response/${surveyId}/${responseId}/mark-reviewed`
      );

      // Update the response status locally
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
    }
  };

  // Parse survey questions to create question map
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
              if (
                pageContent &&
                pageContent.surveys &&
                Array.isArray(pageContent.surveys)
              ) {
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
    } catch (error) {
      console.warn("Failed to parse survey questions:", error);
      return {};
    }
  };

  // Parse answers to display them in a readable format
  const parseAnswers = (
    answers: string,
    questionMap: { [key: string]: string }
  ) => {
    try {
      let cleanedAnswers = answers;
      if (cleanedAnswers.startsWith('("') && cleanedAnswers.endsWith('")')) {
        cleanedAnswers = cleanedAnswers.substring(2, cleanedAnswers.length - 2);
      }
      cleanedAnswers = cleanedAnswers.replace(/\\"/g, '"');
      cleanedAnswers = cleanedAnswers.replace(
        /([{,])\s*([a-zA-Z0-9_\-]+):/g,
        '$1"$2":'
      );

      const parsed = JSON.parse(cleanedAnswers);
      const results: { question: string; answer: string }[] = [];

      if (typeof parsed === "object" && parsed !== null) {
        Object.entries(parsed).forEach(([key, value]) => {
          results.push({
            question: questionMap[key] || key,
            answer: String(value),
          });
        });
      }

      return results;
    } catch (error) {
      return [{ question: "Raw Response", answer: answers }];
    }
  };

  // Render answers in a readable format
  const renderAnswers = (
    answers: string,
    questionMap: Record<string, string>
  ) => {
    const parsedAnswers = parseAnswers(answers, questionMap);

    if (parsedAnswers.length === 0) {
      return <span>No answers</span>;
    }

    const firstAnswer = parsedAnswers[0];
    const remainingCount = parsedAnswers.length - 1;

    return (
      <div className="flex flex-col">
        <span>{`${firstAnswer.answer}`}</span>
        {remainingCount > 0 && (
          <span className="text-sm text-gray-500">
            +{remainingCount} more answers
          </span>
        )}
      </div>
    );
  };

  // Filter responses based on search query and filters
  const filteredResponses = responses.filter((response) => {
    const lowerSearchQuery = searchQuery.toLowerCase();
    const applicantName = response.applicant.name.toLowerCase();
    const surveyName = response.survey.name.toLowerCase();
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

    // Status filter
    if (filterStatus && filterStatus !== "all") {
      if (filterStatus === "reviewed" && !response.reviewed) return false;
      if (filterStatus === "pending" && response.reviewed) return false;
    }

    // Date filter
    if (
      filterDateFrom &&
      new Date(response.submitted_at) < new Date(filterDateFrom)
    )
      return false;
    if (
      filterDateTo &&
      new Date(response.submitted_at) > new Date(filterDateTo)
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
  const columns: ColumnDef<SurveyResponse>[] = [
    {
      accessorKey: "applicant",
      header: () => <div className="text-left font-semibold">Applicant</div>,
      cell: ({ row }) => (
        <div className="font-medium">{row.original.applicant.name}</div>
      ),
    },
    {
      accessorKey: "submitted_at",
      header: () => <div className="text-left font-semibold">Submitted</div>,
      cell: ({ row }) => (
        <div>
          {format(new Date(row.original.submitted_at), "MMM dd, yyyy HH:mm")}
        </div>
      ),
    },
    {
      accessorKey: "answers",
      header: () => <div className="text-left font-semibold">Response</div>,
      cell: ({ row }) => {
        const questionMap = parseQuestions(row.original.survey.qns);
        return (
          <div className="max-w-md truncate" title={row.original.answers}>
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

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Add Go Back Button */}
      <div className="mb-6">
        <Link
          href="/admin/survey"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <IoArrowBack className="w-5 h-5" />
          <span>Back to Surveys</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Survey Responses
      </h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Responses Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
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

        {/* Reviewed Responses Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Reviewed Responses
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {reviewedResponses}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Responses Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg">
                <User className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pending Responses
                </p>
                <p className="text-2xl font-bold text-amber-600">
                  {pendingResponses}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10 shadow-sm">
        {/* Filter Section */}
        <div className="w-full p-4 sm:p-5 border-b bg-gray-50/50">
          <div className="flex flex-col space-y-4">
            {/* Filter Header */}
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4">
              {/* Status Filter */}
              <div className="flex flex-col space-y-1 min-w-[160px] flex-1 max-w-[200px]">
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
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div className="flex flex-col space-y-1 min-w-[200px] flex-1 max-w-[280px]">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Submitted Date
                </label>
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    className="flex-1 min-w-0 px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="From"
                  />
                  <span className="text-xs text-gray-400 px-1">to</span>
                  <input
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    className="flex-1 min-w-0 px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="To"
                  />
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="flex flex-col justify-end min-w-[120px]">
                <button
                  onClick={() => {
                    setFilterStatus("");
                    setFilterDateFrom("");
                    setFilterDateTo("");
                  }}
                  className="px-4 py-2 text-sm text-white bg-blue-500 border border-gray-300 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors whitespace-nowrap"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="w-full p-4 sm:p-5 border-b">
          <div className="relative w-full lg:w-[25rem]">
            <span className="absolute top-4 left-3">
              <BiSearch size={22} className="text-gray-500" />
            </span>
            <input
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 py-4 pl-10 text-base text-black placeholder:text-gray-500 rounded-full bg-[#005DE908] border-none outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Search responses..."
            />
          </div>
        </div>

        {/* Responses Table */}
        <div className="w-full px-4 sm:px-5 overflow-x-auto">
          <CustomDataTable
            columns={columns}
            data={filteredResponses}
            loading={loading}
            noDataMessage={
              searchQuery
                ? `No responses found related to "${searchQuery}"`
                : "No responses available"
            }
            loadingBackgroundColor="#f1f5f9"
            loadingColor="#005DE9"
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default SurveyResponsesPage;
