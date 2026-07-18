import * as XLSX from "xlsx";
import { format } from "date-fns";
import { SurveyResponse } from "@/types/survey/survey";

export interface ExportOptions {
  includeDetailedResponses?: boolean;
  includeSummarySheet?: boolean;
  customFileName?: string;
}

export const exportResponsesToExcel = (
  responses: SurveyResponse[],
  options: ExportOptions = {},
) => {
  const {
    includeDetailedResponses = true,
    includeSummarySheet = true,
    customFileName,
  } = options;

  if (responses.length === 0) {
    throw new Error("No responses to export");
  }

  // Create main responses sheet data
  const mainData = responses.map((response, index) => ({
    "Response #": index + 1,
    "Applicant Name": response.applicant,
    "Survey Name": response.survey,
    "Email Address": response.details.email || "Not provided",
    "Phone Number": response.details.phone || "Not provided",
    "Response Summary": response.response,
    "Submission Date": format(response.timestamp, "yyyy-MM-dd"),
    "Submission Time": format(response.timestamp, "HH:mm:ss"),
    "Day of Week": format(response.timestamp, "EEEE"),
    "Review Status": response.reviewed ? "Reviewed" : "Pending Review",
    "Status Symbol": response.reviewed ? "✓" : "⏳",
  }));

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Add main responses sheet
  const mainSheet = XLSX.utils.json_to_sheet(mainData);

  // Set column widths for better readability
  mainSheet["!cols"] = [
    { wch: 8 }, // Response #
    { wch: 20 }, // Applicant Name
    { wch: 25 }, // Survey Name
    { wch: 25 }, // Email Address
    { wch: 15 }, // Phone Number
    { wch: 50 }, // Response Summary
    { wch: 12 }, // Submission Date
    { wch: 12 }, // Submission Time
    { wch: 12 }, // Day of Week
    { wch: 15 }, // Review Status
    { wch: 8 }, // Status Symbol
  ];

  XLSX.utils.book_append_sheet(workbook, mainSheet, "Survey Responses");

  // Add detailed Q&A sheet if requested
  if (includeDetailedResponses) {
    const detailedData: any[] = [];

    responses.forEach((response, responseIndex) => {
      if (response.details.responses && response.details.responses.length > 0) {
        response.details.responses.forEach((qa, qaIndex) => {
          detailedData.push({
            "Response ID": responseIndex + 1,
            Applicant: response.applicant,
            Survey: response.survey,
            "Question Number": qaIndex + 1,
            "Question Text": qa.question,
            "Answer Text": qa.answer,
            "Answer Length": qa.answer.length,
            "Submission Date": format(
              response.timestamp,
              "yyyy-MM-dd HH:mm:ss",
            ),
            "Review Status": response.reviewed ? "Reviewed" : "Pending",
          });
        });
      }
    });

    if (detailedData.length > 0) {
      const detailedSheet = XLSX.utils.json_to_sheet(detailedData);
      detailedSheet["!cols"] = [
        { wch: 10 }, // Response ID
        { wch: 20 }, // Applicant
        { wch: 25 }, // Survey
        { wch: 8 }, // Question Number
        { wch: 60 }, // Question Text
        { wch: 60 }, // Answer Text
        { wch: 10 }, // Answer Length
        { wch: 20 }, // Submission Date
        { wch: 15 }, // Review Status
      ];
      XLSX.utils.book_append_sheet(
        workbook,
        detailedSheet,
        "Question & Answers",
      );
    }
  }

  // Add summary statistics sheet if requested
  if (includeSummarySheet) {
    const totalResponses = responses.length;
    const reviewedCount = responses.filter((r) => r.reviewed).length;
    const pendingCount = totalResponses - reviewedCount;
    const uniqueSurveys = [...new Set(responses.map((r) => r.survey))];
    const uniqueApplicants = [...new Set(responses.map((r) => r.applicant))];

    // Calculate date range
    const dates = responses.map((r) => r.timestamp);
    const earliestDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const latestDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    const summaryData = [
      { Metric: "Total Responses", Value: totalResponses, Details: "" },
      {
        Metric: "Reviewed Responses",
        Value: reviewedCount,
        Details: `${Math.round((reviewedCount / totalResponses) * 100)}%`,
      },
      {
        Metric: "Pending Responses",
        Value: pendingCount,
        Details: `${Math.round((pendingCount / totalResponses) * 100)}%`,
      },
      {
        Metric: "Unique Surveys",
        Value: uniqueSurveys.length,
        Details: uniqueSurveys.join(", "),
      },
      {
        Metric: "Unique Applicants",
        Value: uniqueApplicants.length,
        Details: "",
      },
      {
        Metric: "Date Range (From)",
        Value: format(earliestDate, "yyyy-MM-dd"),
        Details: format(earliestDate, "EEEE, MMMM do, yyyy"),
      },
      {
        Metric: "Date Range (To)",
        Value: format(latestDate, "yyyy-MM-dd"),
        Details: format(latestDate, "EEEE, MMMM do, yyyy"),
      },
      {
        Metric: "Export Generated",
        Value: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        Details: "Current timestamp",
      },
      {
        Metric: "Average Response Length",
        Value: Math.round(
          responses.reduce((acc, r) => acc + r.response.length, 0) /
            responses.length,
        ),
        Details: "Characters",
      },
    ];

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    summarySheet["!cols"] = [
      { wch: 25 }, // Metric
      { wch: 20 }, // Value
      { wch: 50 }, // Details
    ];

    XLSX.utils.book_append_sheet(workbook, summarySheet, "Export Summary");
  }

  // Generate filename
  const timestamp = format(new Date(), "yyyy-MM-dd_HHmm");
  const filename = customFileName || `survey_responses_${timestamp}.xlsx`;

  // Save the file
  XLSX.writeFile(workbook, filename);

  return {
    filename,
    totalResponses: responses.length,
    reviewedCount: responses.filter((r) => r.reviewed).length,
    sheets: workbook.SheetNames,
  };
};
