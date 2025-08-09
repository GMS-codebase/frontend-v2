"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
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
import { notifications } from "@mantine/notifications";
import { authorizedApi } from "@/utils/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Menu } from "@mantine/core";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { Select, SelectItem } from "@/components/ui/Select";
import { IoArrowBack } from "react-icons/io5";
import { DataTable } from "@/components/core/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { HiDotsHorizontal } from "react-icons/hi";
import Link from "next/link";
import { VscEye } from "react-icons/vsc";

// Types
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
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  gender?: string;
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
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  nationalId?: string;
  applicationNumber?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  approvalStatus?: string;
  user_id?: string;
}

interface SurveyResponse {
  uuid: string;
  user_id?: string;
  id?: number;
  traineeUuid?: string | null;
  answers?: string;
  status?: "SUBMITTED" | "REVIEWED";
  submitted_at?: string;
  survey?: Survey;
  applicant?: Applicant | null;
  trainee?: Trainee | null;
  deletedStatus?: boolean;
  doneAt?: string;
  lastUpdatedAt?: string;
  parsedAnswers?: ParsedAnswer[];
}

interface ParsedAnswer {
  question: string;
  answer: string;
}

// Parse survey questions
const parseQuestions = (qns: string): { [key: string]: string } => {
  if (!qns) return {};
  try {
    let cleanedQns = qns.trim();
    if (cleanedQns.startsWith('("') && cleanedQns.endsWith('")')) {
      cleanedQns = cleanedQns.substring(2, cleanedQns.length - 2);
    }
    if (cleanedQns.startsWith('"') && cleanedQns.endsWith('"')) {
      cleanedQns = cleanedQns.substring(1, cleanedQns.length - 1);
    }
    cleanedQns = cleanedQns.replace(/\\"/g, '"');
    cleanedQns = cleanedQns.replace(/([{,])\s*([a-zA-Z0-9_\-]+):/g, '$1"$2":');

    const parsed = JSON.parse(cleanedQns);
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
    console.warn(
      "Failed to parse survey questions:",
      error,
      "Problematic qns:",
      qns
    );
    notifications.show({
      message: "Failed to parse survey questions data.",
      color: "red",
    });
    return {};
  }
};

// Parse answers
const parseAnswers = (
  answers: string,
  questionMap: { [key: string]: string }
): ParsedAnswer[] => {
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
    const results: ParsedAnswer[] = [];

    if (typeof parsed === "object" && parsed !== null) {
      Object.entries(parsed).forEach(([key, value]) => {
        if (!key.includes("{") && !key.includes('"question"')) {
          results.push({
            question: questionMap[key] || key,
            answer: String(value),
          });
          return;
        }
        if (key.includes("{") && key.includes('"question"')) {
          try {
            let cleanKey = key;
            if (cleanKey.startsWith('"{') && cleanKey.endsWith('}"'))
              cleanKey = cleanKey.slice(1, -1);
            const innerJson = JSON.parse(cleanKey);
            if (innerJson.question && innerJson.answer) {
              results.push({
                question: innerJson.question,
                answer: innerJson.answer,
              });
            } else if (innerJson.question) {
              results.push({
                question: innerJson.question,
                answer: String(value) || "No answer provided",
              });
            }
          } catch (innerError) {
            const questionMatch = key.match(/"question":\s*"([^"]*)"/);
            const answerMatch = key.match(/"answer":\s*"([^"]*)"/);
            if (questionMatch) {
              results.push({
                question: questionMatch[1],
                answer: answerMatch
                  ? answerMatch[1]
                  : String(value) || "No answer provided",
              });
            } else {
              results.push({
                question: "Survey Question",
                answer: String(value) || "No answer provided",
              });
            }
          }
          return;
        }
        results.push({
          question: questionMap[key] || key,
          answer: String(value),
        });
      });
    }

    if (Array.isArray(parsed)) {
      parsed.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          results.push({
            question:
              item.question ||
              questionMap[index.toString()] ||
              `Question ${index + 1}`,
            answer: item.answer || "No answer provided",
          });
        } else {
          results.push({
            question: questionMap[index.toString()] || `Question ${index + 1}`,
            answer: String(item),
          });
        }
      });
    }

    if (results.length === 0) {
      const patterns = [/("question":\s*"[^"]*"\s*,\s*"answer":\s*"[^"]*")/g];
      for (const pattern of patterns) {
        const matches = [...answers.matchAll(pattern)];
        if (matches.length > 0) {
          return matches.map((match) => {
            const [fullMatch] = match;
            const questionMatch = fullMatch.match(/"question":\s*"([^"]*)"/);
            const answerMatch = fullMatch.match(/"answer":\s*"([^"]*)"/);
            return {
              question: questionMatch ? questionMatch[1] : "Unknown Question",
              answer: answerMatch ? answerMatch[1] : "No answer",
            };
          });
        }
      }
      return [{ question: "Raw Survey Response", answer: answers }];
    }

    return results;
  } catch (error) {
    return [{ question: "Raw Survey Response", answer: answers }];
  }
};

const SurveyViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [surveyTypeFilter, setSurveyTypeFilter] = useState<string>("all");
  const [dateFromFilter, setDateFromFilter] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResponses, setTotalResponses] = useState(0);
  const [pageSize] = useState(10);

  const fetchSurvey = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authorizedApi.get(`/survey/single-survey/${id}`);
      setSurvey(response.data);
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
  }, [id]);

  const fetchResponses = useCallback(
    async (page = 1) => {
      try {
        setLoading(page === 1);
        const response = await authorizedApi.get(
          `/survey/getSurveyResponses/${id}`
        );

        let responsesData = [];
        if (Array.isArray(response.data)) {
          responsesData = response.data;
        } else {
          console.error(
            "API returned unexpected data structure:",
            response.data
          );
          notifications.show({
            title: "Error",
            message: "Received unexpected data format for responses.",
            color: "red",
          });
          setResponses([]);
          setTotalResponses(0);
          setTotalPages(1);
          setCurrentPage(1);
          setLoading(false);
          return;
        }

        // Fetch applicant and trainee names
        const enrichedResponses = await Promise.all(
          responsesData.map(async (item) => {
            let enrichedItem = { ...item };

            // Fetch applicant name if available
            if (item.applicant && item.applicant.uuid && !item.applicant.name) {
              try {
                const applicantResponse = await authorizedApi.get(
                  `/applicant/${item.applicant.uuid}/by-id`
                );
                enrichedItem = {
                  ...enrichedItem,
                  applicant: {
                    ...item.applicant,
                    name: applicantResponse.data.name || "N/A",
                  },
                };
              } catch (err) {
                console.warn(
                  `Failed to fetch applicant name for uuid ${item.applicant.uuid}:`,
                  err
                );
              }
            }

            // Fetch trainee name if available
            if (item.trainee && item.trainee.uuid && !item.trainee.name) {
              try {
                const traineeResponse = await authorizedApi.get(
                  `/applicant/trainees/${item.trainee.uuid}`
                );
                enrichedItem = {
                  ...enrichedItem,
                  trainee: {
                    ...item.trainee,
                    name: traineeResponse.data.name || "N/A",
                  },
                };
              } catch (err) {
                console.warn(
                  `Failed to fetch trainee name for uuid ${item.trainee.uuid}:`,
                  err
                );
              }
            }

            const questionMap = parseQuestions(item.survey?.qns ?? "");
            const parsedAnswers = parseAnswers(item.answers ?? "", questionMap);

            return {
              ...enrichedItem,
              parsedAnswers,
            };
          })
        );

        const startIndex = (page - 1) * pageSize;
        const paginatedResponses = enrichedResponses.slice(
          startIndex,
          startIndex + pageSize
        );
        const total = enrichedResponses.length;
        const totalPagesCalc = Math.ceil(total / pageSize);

        setResponses(paginatedResponses);
        setTotalResponses(total);
        setTotalPages(totalPagesCalc);
        setCurrentPage(page);
      } catch (err: any) {
        console.error("Error fetching responses:", err);
        notifications.show({
          message:
            err.response?.data?.message || "Failed to load survey responses",
          color: "red",
        });
        setResponses([]);
        setTotalResponses(0);
        setTotalPages(1);
        setCurrentPage(1);
      } finally {
        setLoading(false);
      }
    },
    [id, pageSize]
  );

  useEffect(() => {
    if (id) {
      fetchSurvey();
      fetchResponses(1);
    }
  }, [id, fetchSurvey, fetchResponses]);


  console.log(responses)

  const filteredResponses = responses.filter((response) => {
    if (statusFilter === "reviewed" && response.status !== "REVIEWED")
      return false;
    if (statusFilter === "pending" && response.status !== "SUBMITTED")
      return false;
    if (
      surveyTypeFilter !== "all" &&
      response.survey?.survey_TYPE !== surveyTypeFilter
    )
      return false;
    const submittedDate = response.submitted_at
      ? new Date(response.submitted_at)
      : new Date();
    if (dateFromFilter && submittedDate < new Date(dateFromFilter))
      return false;
    if (dateToFilter && submittedDate > new Date(dateToFilter)) return false;
    const searchLower = searchQuery.toLowerCase();
    const applicantName = response.applicant?.name?.toLowerCase() || "";
    const traineeName = response.trainee?.name?.toLowerCase() || "";
    const email =
      response.applicant?.email?.toLowerCase() ||
      response.trainee?.email?.toLowerCase() ||
      "";
    return (
      applicantName.includes(searchLower) ||
      traineeName.includes(searchLower) ||
      email.includes(searchLower)
    );
  });

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchResponses(page);
    }
  };

  const handleExportToExcel = useCallback(() => {
    try {
      const headers = [
        "Respondent",
        "Type",
        "Email",
        "Submitted",
        "Status",
        "Responses",
      ];
      const csvContent = [
        headers.join(","),
        ...filteredResponses.map((response) => {
          const respondent =
            response.applicant?.name || response.trainee?.name || "N/A";
          const respondentType = response.applicant
            ? "Applicant"
            : response.trainee
              ? "Trainee"
              : "N/A";
          const email =
            response.applicant?.email || response.trainee?.email || "N/A";
          const submitted = response.submitted_at
            ? format(new Date(response.submitted_at), "yyyy-MM-dd HH:mm")
            : "N/A";
          const status = response.status || "N/A";
          let answersText = "No answers";
          try {
            const questionMap = parseQuestions(response.survey?.qns ?? "");
            const parsedAnswers = parseAnswers(
              response.answers ?? "",
              questionMap
            );
            answersText = parsedAnswers
              .map((r) => `${r.question}: ${r.answer}`)
              .join("; ");
          } catch (error) {
            console.warn("Failed to parse answers for export:", error);
          }
          return [
            respondent,
            respondentType,
            email,
            submitted,
            status,
            `"${answersText}"`,
          ].join(",");
        }),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `survey-${survey?.name || id}-responses-${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      notifications.show({
        message: "CSV file exported successfully",
        color: "green",
      });
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      notifications.show({
        message: "Failed to export CSV file",
        color: "red",
      });
    }
  }, [filteredResponses, survey, id]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSurveyTypeFilter("all");
    setDateFromFilter("");
    setDateToFilter("");
  };


  const columns: ColumnDef<SurveyResponse>[] = [
    {
      accessorKey: "respondent",
      header: "Respondent",
      cell: ({ row }) => {
        const respondent = row.original.applicant || row.original.trainee;
        const respondentType = row.original.applicant
          ? "Applicant"
          : row.original.trainee
            ? "Trainee"
            : "N/A";

        return (
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{respondent?.name || "N/A"}</p>
              <p className="text-sm text-gray-500">{respondent?.email || "N/A"}</p>
              <p className="text-xs text-blue-600">{respondentType}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "submitted_at",
      header: "Submitted",
      cell: ({ row }) => {
        const submittedAt = row.original.submitted_at;
        return (
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {submittedAt ? format(new Date(submittedAt), "MMM dd, yyyy") : "N/A"}
              </p>
              <p className="text-xs text-gray-500">
                {submittedAt ? format(new Date(submittedAt), "HH:mm") : "N/A"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={status === "REVIEWED" ? "success" : "warning"}>
            {status === "REVIEWED" ? "Reviewed" : "Pending"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const respondentId =
          row.original.applicant?.uuid || row.original.trainee?.uuid || "unknown";

        return (
          <div>
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
                    href={`/admin/surveys/responses/${id}/${respondentId}`}
                    className="w-full py-1 flex text-base items-center gap-3 text-[#576074]"
                  >
                    <VscEye size={21} color="#576074" />
                    View Details
                  </Link>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        );
      },
    },
  ];

  const reviewedCount = filteredResponses.filter(
    (r) => r.status === "REVIEWED"
  ).length;
  const pendingCount = filteredResponses.filter(
    (r) => r.status === "SUBMITTED"
  ).length;

  if (loading) {
    return (
      <div className="w-full p-6  text-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading survey data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 ">
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
      <div className="w-full p-6 ">
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

  return (
    <div className=" bg-gray-50">
      <div className=" px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-blue-500 mb-4 hover:underline font-medium"
              >
                <IoArrowBack size={18} /> Back to Surveys
              </button>
              <h1 className="text-3xl font-bold text-blue-600">
                Survey Responses for &quot;{survey.name}&quot;
              </h1>
              <p className="mt-1 text-gray-600">
                Manage and analyze responses for {survey.name}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleExportToExcel}
                variant="secondary"
                disabled={filteredResponses.length === 0}
              >
                <Download className="w-4 h-4 mr-2" /> Export CSV
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
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

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <div className="xl:col-span-2">
                  <Input
                    placeholder="Search responses, names, emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search className="w-4 h-4 text-gray-400" />}
                  />
                </div>
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                  </Select>
                </div>
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
                <div>
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
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

          <DataTable
            columns={columns}
            data={filteredResponses ?? []}
            loading={loading}
            noDataMessage={
              responses.length === 0
                ? "No survey responses have been submitted yet."
                : "No responses match your current filters."
            }
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages} ({totalResponses}{" "}
                total responses)
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
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
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyViewPage;
