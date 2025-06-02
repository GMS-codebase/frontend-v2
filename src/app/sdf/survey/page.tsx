"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Search,
  Download,
  Eye,
  MoreHorizontal,
  CheckCheck,
  User,
  Clock,
  FileText,
} from "lucide-react";
import { format } from "date-fns";

import { Survey, SurveyResponse } from "@/types/survey/survey";
import { authorizedApi } from "@/utils/api";
import { exportResponsesToExcel } from "@/utils/survey/excelExport";

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
import { useToast } from "@/components/ui/Toast";
import ResponseDetailsModal from "@/components/survey/ResponseDetailsModal";
import Link from "next/link";
import { notifications } from "@mantine/notifications";

const SurveyPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState<string>("all");
  const [selectedResponse, setSelectedResponse] =
    useState<SurveyResponse | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // State for surveys and responses
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [isOpenResponseDetails, setIsOpenResponseDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch surveys from API
  const fetchSurveys = useCallback(async () => {
    try {
      const response = await authorizedApi.get("/survey/get-all-survey");
      const mappedSurveys = response.data.map((survey: any) => ({
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
      }));
      setSurveys(mappedSurveys);
    } catch (error) {
      console.error("Error fetching surveys:", error);
      notifications.show({
        message: "Failed to load surveys",
        color: "red",
      });
    }
  }, []);

  // Fetch survey responses from API
  const fetchResponses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authorizedApi.get(
        "/survey/getAllSurveyResponses?page=1&limit=100"
      );

      const mappedResponses: SurveyResponse[] = response.data.data.map(
        (item: any) => {
          // Parse answers JSON
          let answers: { [key: string]: string } = {};
          try {
            answers = item.answers ? JSON.parse(item.answers) : {};
          } catch (error) {
            console.warn("Failed to parse answers JSON:", error);
          }

          // Parse survey questions (qns) to map question IDs to titles
          let questionMap: { [key: string]: string } = {};
          try {
            const qns = JSON.parse(item.survey.qns);
            Object.values(qns).forEach((section: any) => {
              section.pages?.forEach((page: any) => {
                page.surveys?.forEach((survey: any) => {
                  questionMap[survey.id] = survey.title;
                });
              });
            });
          } catch (error) {
            console.warn("Failed to parse qns JSON:", error);
          }

          // Map answers to question-answer pairs
          const parsedResponses = Object.entries(answers).map(
            ([questionId, answer]) => ({
              question: questionMap[questionId] || questionId,
              answer: String(answer),
            })
          );

          return {
            uuid: item.uuid,
            id: item.id,
            survey_id: item.survey.id.toString(),
            applicant: item.applicant.name,
            survey: item.survey.name,
            response: item.answers
              ? JSON.stringify(item.answers)
              : "No answers provided",
            timestamp: new Date(item.submitted_at),
            reviewed: false,
            details: {
              email: item.applicant.email,
              phone: item.applicant.phone,
              address: item.applicant.address,
              responses:
                parsedResponses.length > 0 ? parsedResponses : undefined,
            },
          };
        }
      );

      setResponses(mappedResponses);
      notifications.show({
        message: "Responses loaded successfully",
        color: "green",
      });
    } catch (error) {
      console.error("Error fetching responses:", error);
      notifications.show({
        message: "Failed to load responses",
        color: "red",
      });
    } finally {
      setLoading(false);
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
      await authorizedApi.put(`/survey/responses/${responseId}/mark-reviewed`);

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

  // Filter responses based on search query, survey selection, and status
  const filteredResponses = responses.filter((response) => {
    if (selectedSurvey !== "all" && response.survey_id !== selectedSurvey) {
      return false;
    }
    if (statusFilter === "reviewed" && !response.reviewed) return false;
    if (statusFilter === "pending" && response.reviewed) return false;

    return (
      response.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.survey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      response.response.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (response.details.email
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ??
        false) ||
      (response.details.responses?.some((r) =>
        r.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ) ??
        false)
    );
  });

  // Handle marking multiple responses as reviewed
  const handleMarkAllAsReviewed = useCallback(async () => {
    try {
      setIsLoading(true);
      const unreviewed = filteredResponses.filter((r) => !r.reviewed);

      for (const response of unreviewed) {
        await authorizedApi.put(
          `/survey/responses/${response.uuid}/mark-reviewed`
        );
      }

      setResponses((prevResponses) =>
        prevResponses.map((response) =>
          unreviewed.some((ur) => ur.uuid === response.uuid)
            ? { ...response, reviewed: true }
            : response
        )
      );

      notifications.show({
        message: `${unreviewed.length} responses marked as reviewed`,
        color: "green",
      });
    } catch (error) {
      console.error("Error marking responses as reviewed:", error);
      notifications.show({
        message: "Failed to mark responses as reviewed",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  }, [filteredResponses]);

  // Handle Excel export
  const handleExportToExcel = useCallback(() => {
    try {
      exportResponsesToExcel(filteredResponses);
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

  const renderResponseRow = (response: SurveyResponse) => (
    <TableRow key={response.uuid}>
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
            <User className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{response.applicant}</p>
            {response.details.email && (
              <p className="text-sm text-gray-500">{response.details.email}</p>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium text-gray-900">{response.survey}</p>
          <p className="text-sm text-gray-500">Survey Response</p>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {format(response.timestamp, "MMM dd, yyyy")}
            </p>
            <p className="text-xs text-gray-500">
              {format(response.timestamp, "HH:mm")}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="max-w-md">
          <p
            className="text-sm text-gray-900 line-clamp-2"
            title={
              response.details.responses
                ? response.details.responses
                    .map((r) => `${r.question}: ${r.answer}`)
                    .join("; ")
                : response.response
            }
          >
            {response.details.responses && response.details.responses.length > 0
              ? response.details.responses[0].answer
              : response.response}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={response.reviewed ? "success" : "warning"}>
          {response.reviewed ? "Reviewed" : "Pending"}
        </Badge>
      </TableCell>
      <TableCell>
        <Dropdown
          trigger={
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          }
        >
          <DropdownItem
          // onClick={() => {
          //   setSelectedResponse(response);
          //   setIsOpenResponseDetails(true);
          // }}
          >
            <Link
              href={`/sdf/survey/view/${response.uuid}`}
              className="flex gap-2 items-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Link>
          </DropdownItem>
          {!response.reviewed && (
            <DropdownItem
              onClick={() => handleMarkAsReviewed(response.uuid)}
              disabled={isLoading}
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark as Reviewed
            </DropdownItem>
          )}
        </Dropdown>
      </TableCell>
    </TableRow>
  );

  // Calculate statistics
  const totalResponses = filteredResponses.length;
  const reviewedCount = filteredResponses.filter((r) => r.reviewed).length;
  const pendingCount = totalResponses - reviewedCount;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-blue-500">
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
                variant="secondary"
                disabled={filteredResponses.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
              {pendingCount > 0 && (
                <Button
                  onClick={handleMarkAllAsReviewed}
                  variant="primary"
                  disabled={isLoading}
                  loading={isLoading}
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark All as Reviewed ({pendingCount})
                </Button>
              )}
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
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Review Rate
                    </p>
                    <p className="text-2xl font-bold text-primary-600">
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
              <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <Input
                    placeholder="Search responses, applicants, emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search className="w-4 h-4 text-gray-400" />}
                  />
                </div>

                <div className="w-full lg:w-64">
                  <Select
                    value={selectedSurvey}
                    onValueChange={setSelectedSurvey}
                  >
                    <SelectItem value="all">All Surveys</SelectItem>
                    {surveys.map((survey) => (
                      <SelectItem key={survey.uuid} value={survey.uuid}>
                        {survey.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="w-full lg:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                  </Select>
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
                    <TableHead>Applicant</TableHead>
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
          </Card>
        </div>
      </div>

      {/* Response Details Modal */}
      <ResponseDetailsModal
        isOpen={isOpenResponseDetails}
        onClose={() => {
          setIsOpenResponseDetails(false);
          setSelectedResponse(null);
        }}
        response={selectedResponse}
      />
    </div>
  );
};

export default SurveyPage;
