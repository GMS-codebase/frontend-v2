"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Search,
  Download,
  Eye,
  MoreHorizontal,
  User,
  Clock,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCheck,
} from "lucide-react";
import { format } from "date-fns";
import { HiDotsHorizontal } from "react-icons/hi";
import Link from "next/link";
import { notifications } from "@mantine/notifications";
import { authorizedApi } from "@/utils/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { Select, SelectItem } from "@/components/ui/Select";
import { Menu } from "@mantine/core";
import { VscEye } from "react-icons/vsc";
import * as XLSX from "xlsx";

// Types based on the API response
interface Survey {
  id: number;
  name: string;
  qns: string;
  expiry_date: string;
  survey_status: string;
  created_at: string;
  updated_at: string;
  survey_TYPE: string;
  hasSurvey_Started: boolean;
  surveyStartingTime: string;
}

interface Applicant {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  nationalId?: string;
  user_id?: string;
  age?: number;
  description?: string;
  po_box?: string;
  has_completed_profile?: boolean;
  contact_count?: number;
}

interface Trainee {
  uuid: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  gender: string;
  nationalId: string;
  applicationNumber: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  approvalStatus?: string;
  user_id: string;
}

interface SurveyResponse {
  uuid: string;
  user_id: string;
  id: number;
  traineeUuid?: string | null;
  answers: string;
  status: "SUBMITTED" | "REVIEWED";
  submitted_at: string;
  survey: Survey;
  applicant: Applicant | null;
  trainee: Trainee | null;
  deletedStatus: boolean;
  doneAt: string;
  lastUpdatedAt: string;
}

interface ApiResponse {
  data: SurveyResponse[];
  total: number;
  page: string;
  lastPage: number;
}

interface ParsedAnswer {
  question: string;
  answer: string;
}

const SurveyResponsesPage = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [surveyTypeFilter, setSurveyTypeFilter] = useState<string>("all");
  const [dateFromFilter, setDateFromFilter] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string>("");

  // Data state
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResponses, setTotalResponses] = useState(0);
  const [pageSize] = useState(10);

  // Fetch surveys for filter dropdown
  const fetchSurveys = useCallback(async () => {
    try {
      const response = await authorizedApi.get("/survey/get-all-survey");
      const mappedSurveys = response.data.map((survey: any) => {
        const isExpired =
          survey.survey_status === "ended" ||
          new Date(survey.expiry_date) < new Date();
        return {
          id: survey.id,
          name: survey.name,
          qns: survey.qns,
          expiry_date: survey.expiry_date,
          survey_status: isExpired ? "ENDED" : survey.survey_status,
          created_at: survey.created_at,
          updated_at: survey.updated_at,
          survey_TYPE: survey.survey_TYPE,
          hasSurvey_Started: survey.hasSurvey_Started,
          surveyStartingTime: survey.surveyStartingTime,
        };
      });
      setSurveys(mappedSurveys);
    } catch (error) {
      console.error("Error fetching surveys:", error);
      notifications.show({
        message: "Failed to load surveys",
        color: "red",
      });
    }
  }, []);

  // Parse survey questions to create question map
  const parseQuestions = (qns: string): { [key: string]: string } => {
    try {
      const parsed = JSON.parse(qns);
      const questionMap: { [key: string]: string } = {};

      if (Array.isArray(parsed)) {
        // Simple array format: [{"question": "How do you rate our service?"}]
        parsed.forEach((item: any, index: number) => {
          if (item.question) {
            questionMap[`q${index + 1}`] = item.question;
          }
        });
      } else if (typeof parsed === "object") {
        // Complex nested format with sections and pages
        Object.values(parsed).forEach((section: any) => {
          if (section && section.pages && Array.isArray(section.pages)) {
            section.pages.forEach((page: any) => {
              if (page && page.surveys && Array.isArray(page.surveys)) {
                page.surveys.forEach((survey: any) => {
                  if (survey.id && survey.title) {
                    questionMap[survey.id] = survey.title;
                  }
                });
              }
            });
          }
        });
      }

      return questionMap;
    } catch (error) {
      console.warn("Failed to parse questions:", error);
      return {};
    }
  };

  // Parse response answers
  const parseAnswers = (
    answers: string,
    questionMap: { [key: string]: string }
  ): ParsedAnswer[] => {
    try {
      const parsed = JSON.parse(answers);
      return Object.entries(parsed).map(([questionId, answer]) => ({
        question: questionMap[questionId] || questionId,
        answer: String(answer),
      }));
    } catch (error) {
      console.warn("Failed to parse answers:", error);
      return [];
    }
  };

  // Fetch survey responses with pagination
  const fetchResponses = useCallback(
    async (page = 1) => {
      try {
        setLoading(page === 1);
        const response = await authorizedApi.get(
          `/survey/getAllSurveyResponses?page=${page}&limit=${pageSize}`
        );

        const apiResponse: ApiResponse = response.data;

        // Process responses and add parsed answers
        const processedResponses = apiResponse.data.map((item) => {
          const questionMap = parseQuestions(item.survey.qns);
          const parsedAnswers = parseAnswers(item.answers, questionMap);

          return {
            ...item,
            parsedAnswers,
          };
        });

        setResponses(processedResponses);
        setTotalResponses(apiResponse.total);
        setTotalPages(apiResponse.lastPage);
        setCurrentPage(Number.parseInt(apiResponse.page));
      } catch (error) {
        console.error("Error fetching responses:", error);
        notifications.show({
          message: "Failed to load responses",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  // Load data on component mount
  useEffect(() => {
    fetchSurveys();
    fetchResponses(1);
  }, [fetchSurveys, fetchResponses]);

  // Filter responses based on all filters
  const filteredResponses = responses.filter((response) => {
    // Survey filter
    if (
      selectedSurvey !== "all" &&
      response.survey.id.toString() !== selectedSurvey
    ) {
      return false;
    }

    // Status filter
    if (statusFilter === "reviewed" && response.status !== "REVIEWED")
      return false;
    if (statusFilter === "pending" && response.status !== "SUBMITTED")
      return false;

    // Survey type filter
    if (
      surveyTypeFilter !== "all" &&
      response.survey.survey_TYPE !== surveyTypeFilter
    ) {
      return false;
    }

    // Date filter
    const submittedDate = new Date(response.submitted_at);
    if (dateFromFilter && submittedDate < new Date(dateFromFilter))
      return false;
    if (dateToFilter && submittedDate > new Date(dateToFilter)) return false;

    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const applicantName = response.applicant?.name?.toLowerCase() || "";
    const traineeName = response.trainee?.firstname?.toLowerCase() + " " + response.trainee?.lastname?.toLowerCase() || "";
    const surveyName = response.survey.name.toLowerCase();
    const email =
      response.applicant?.email?.toLowerCase() ||
      response.trainee?.email?.toLowerCase() ||
      "";

    return (
      applicantName.includes(searchLower) ||
      traineeName.includes(searchLower) ||
      surveyName.includes(searchLower) ||
      email.includes(searchLower)
    );
  });

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchResponses(page);
    }
  };

  // Handle Excel export
  const handleExportToExcel = useCallback(() => {
    try {
      // Create Excel workbook
      const workbook = XLSX.utils.book_new();
      
      // Prepare data for export
      const exportData = filteredResponses.map((response) => {
          const respondent =
            response.applicant?.name || response.trainee?.firstname + " " + response.trainee?.lastname || "N/A";
          const respondentType = response.applicant ? "Applicant" : "Trainee";
          const email =
            response.applicant?.email || response.trainee?.email || "N/A";
          const survey = response.survey.name;
          const submitted = format(
            new Date(response.submitted_at),
            "yyyy-MM-dd HH:mm"
          );
          const status = response.status;

          // Parse answers for export
          let answersText = "No answers";
          try {
            const questionMap = parseQuestions(response.survey.qns);
            const parsedAnswers = parseAnswers(response.answers, questionMap);
            answersText = parsedAnswers
              .map((r) => `${r.question}: ${r.answer}`)
              .join("; ");
          } catch (error) {
            console.warn("Failed to parse answers for export:", error);
          }

        return {
          Respondent: respondent,
          Type: respondentType,
          Email: email,
          Survey: survey,
          Submitted: submitted,
          Status: status,
          Responses: answersText,
        };
      });

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths for better readability
      worksheet["!cols"] = [
        { wch: 25 }, // Respondent
        { wch: 12 }, // Type
        { wch: 30 }, // Email
        { wch: 25 }, // Survey
        { wch: 20 }, // Submitted
        { wch: 12 }, // Status
        { wch: 60 }, // Responses
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Survey Responses");

      // Generate filename
      const filename = `survey-responses-${format(new Date(), "yyyy-MM-dd")}.xlsx`;

      // Save the Excel file
      XLSX.writeFile(workbook, filename);

      notifications.show({
        message: "Excel file exported successfully",
        color: "green",
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      notifications.show({
        message: "Failed to export Excel file",
        color: "red",
      });
    }
  }, [filteredResponses]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSurvey("all");
    setStatusFilter("all");
    setSurveyTypeFilter("all");
    setDateFromFilter("");
    setDateToFilter("");
  };

  // Render response row
  const renderResponseRow = (response: SurveyResponse) => {
    const respondent = response.applicant || response.trainee;
    const respondentType = response.applicant ? "Applicant" : "Trainee";
    const isTrainee = response.trainee?.uuid ? true : false;

    // Parse answers for display
    let displayAnswer = "No answers provided";
    let answerCount = 0;
    try {
      const questionMap = parseQuestions(response.survey.qns);
      const parsedAnswers = parseAnswers(response.answers, questionMap);
      if (parsedAnswers.length > 0) {
        displayAnswer = parsedAnswers[0].answer;
        answerCount = parsedAnswers.length;
      }
    } catch (error) {
      console.warn("Failed to parse answers for display:", error);
    }

    return (
      <TableRow key={response.uuid}>
        <TableCell>
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {response.applicant ? response.applicant.name : response.trainee ? response.trainee.firstname + " " + response.trainee.lastname : "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                {response.applicant?.email || response.trainee?.email || "N/A"}
              </p>
              <p className="text-xs text-blue-600">{respondentType}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div>
            <p className="font-medium text-gray-900">{response.survey.name}</p>
            <p className="text-sm text-gray-500">
              {response.survey.survey_TYPE}
            </p>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {format(new Date(response.submitted_at), "MMM dd, yyyy")}
              </p>
              <p className="text-xs text-gray-500">
                {format(new Date(response.submitted_at), "HH:mm")}
              </p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="max-w-md">
            <p
              className="text-sm text-gray-900 line-clamp-2"
              title={displayAnswer}
            >
              {displayAnswer}
            </p>
            {answerCount > 1 && (
              <p className="text-xs text-gray-500">
                +{answerCount - 1} more answers
              </p>
            )}
          </div>
        </TableCell>
        <TableCell>
          <Badge
            variant={response.status === "REVIEWED" ? "success" : "warning"}
          >
            {response.status === "REVIEWED" ? "Reviewed" : "Pending"}
          </Badge>
        </TableCell>
        <TableCell>
          <Menu shadow="lg" width={200}>
            <Menu.Target>
              <button
                style={{
                  background:
                    "linear-gradient(84.73deg, #005DE9 10.01%, #0546A8 114.53%)",
                }}
                className="p-3 rounded-full border text-white hover:bg-red-100"
              >
                <HiDotsHorizontal size={25} color="white" />
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>
                <h1 className="text-lg">Actions</h1>
              </Menu.Label>
              <Menu.Divider />
              <Menu.Item className="bg-[#F0F0F0]">
                <Link
                  href={`/sdf/survey/responses/${response.survey.id}/${isTrainee ? "trainee" : "applicant"}/${respondent?.uuid}`}
                  className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                >
                  <VscEye size={21} color="#576074" />
                  View Details
                </Link>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </TableCell>
      </TableRow>
    );
  };

  // Calculate statistics
  const reviewedCount = filteredResponses.filter(
    (r) => r.status === "REVIEWED"
  ).length;
  const pendingCount = filteredResponses.filter(
    (r) => r.status === "SUBMITTED"
  ).length;

  return (
    <div className="font-[Urbanist] text-[1.125rem] font-medium bg-white min-h-screen">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-blue-600">
                Survey Responses
              </h1>
              <p className="mt-1 text-gray-600">
                Manage and analyze all survey responses with comprehensive
                insights
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleExportToExcel}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Excel
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                    <CheckCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Reviewed
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {reviewedCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Pending Review
                    </p>
                    <p className="text-2xl font-bold text-amber-600">
                      {pendingCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Review Rate
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {totalResponses > 0
                        ? Math.round((reviewedCount / totalResponses) * 100)
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {/* Search */}
                <div className="xl:col-span-2">
                  <Input
                    placeholder="Search responses, names, emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search className="w-4 h-4 text-gray-400" />}
                  />
                </div>

                {/* Survey Filter */}
                <div>
                  <Select
                    value={selectedSurvey}
                    onValueChange={setSelectedSurvey}
                  >
                    <SelectItem value="all">All Surveys</SelectItem>
                    {surveys.map((survey) => (
                      <SelectItem key={survey.id} value={survey.id.toString()}>
                        {survey.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {/* Status Filter */}
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                  </Select>
                </div>

                {/* Survey Type Filter */}
                <div>
                  <Select
                    value={surveyTypeFilter}
                    onValueChange={setSurveyTypeFilter}
                  >
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="TRAINEESURVEY">
                      Trainee Survey
                    </SelectItem>
                    <SelectItem value="COMPANYSURVEY">
                      Company Survey
                    </SelectItem>
                    <SelectItem value="GENERALSURVEY">
                      General Survey
                    </SelectItem>
                  </Select>
                </div>

                {/* Clear Filters */}
                <div>
                  <Button
                    variant="primary"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>

              {/* Date Range Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateFromFilter}
                    onChange={(e) => setDateFromFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateToFilter}
                    onChange={(e) => setDateToFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responses Table */}
          <Card padding="none">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Respondent</TableHead>
                    <TableHead>Survey</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Response</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <td colSpan={6} className="text-center py-12">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          <span className="ml-3 text-gray-600">
                            Loading responses...
                          </span>
                        </div>
                      </td>
                    </TableRow>
                  ) : filteredResponses.length === 0 ? (
                    <TableRow>
                      <td colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <FileText className="w-12 h-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No responses found
                          </h3>
                          <p className="text-gray-600">
                            {responses.length === 0
                              ? "No survey responses have been submitted yet."
                              : "No responses match your current filters."}
                          </p>
                        </div>
                      </td>
                    </TableRow>
                  ) : (
                    filteredResponses.map(renderResponseRow)
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing page {currentPage} of {totalPages} ({totalResponses}{" "}
                  total responses)
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="primary"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {/* Page numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum =
                        Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                        i;
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === currentPage ? "primary" : "outline"
                          }
                          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="primary"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SurveyResponsesPage;
