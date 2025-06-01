"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { format } from "date-fns";
import {
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
} from "react-icons/fi";
import { BsClipboardCheck } from "react-icons/bs";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import type { SurveyResponse } from "@/app/admin/survey/types"; // Import SurveyResponse type

const ResponseDetailsPage = () => {
  const router = useRouter();
  const { surveyId, applicantUuid } = useParams<{
    surveyId: string;
    applicantUuid: string;
  }>(); // Extract both parameters

  const [responseData, setResponseData] = useState<SurveyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawAnswersString, setRawAnswersString] = useState<string | null>(null);
  const [parsedAnswers, setParsedAnswers] = useState<any>(null);

  const fetchResponseDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch single response details by SurveyId and ApplicantUuid
      const response = await authorizedApi.get<SurveyResponse>(
        `/survey/survey-response/${surveyId}/${applicantUuid}` // Use the new API endpoint
      );
      setResponseData(response.data);

      // Parse the answers string if it exists and is a string
      if (response.data?.answers && typeof response.data.answers === "string") {
        setRawAnswersString(response.data.answers);
        try {
          setParsedAnswers(JSON.parse(response.data.answers));
        } catch (parseError) {
          console.error("Error parsing answers JSON:", parseError);
          setParsedAnswers(null); // Set to null if parsing fails
          notifications.show({
            title: "Warning",
            message: "Could not parse response answers data.",
            color: "yellow",
          });
        }
      } else {
        setRawAnswersString(null);
        setParsedAnswers(null);
      }
    } catch (err: any) {
      console.error("Error fetching response details:", err);
      setError(
        err.response?.data?.message || "Failed to fetch response details."
      );
      notifications.show({
        title: "Error",
        message: error || "Failed to fetch response details.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, [surveyId, applicantUuid, error]); // Added error to dependency array for notifications

  useEffect(() => {
    if (surveyId) {
      fetchResponseDetails();
    }
  }, [surveyId, fetchResponseDetails]);

  // If loading, display a loading message or spinner
  if (loading) {
    return <div className="p-6 text-center">Loading response details...</div>;
  }

  // If there's an error and no data, display an error message
  if (error && !responseData) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  // If no data is found after loading
  if (!responseData) {
    return <div className="p-6 text-center">Response not found.</div>;
  }

  // Destructure data for easier access
  const { applicant, survey, submitted_at, reviewed } = responseData;

  // Mock data structure is different, so adjust rendering to use fetched data
  // Find comment for a specific question - need to adapt this based on API response structure
  // The API response doesn't seem to include comments directly in this payload, so I'll remove the findComment function and comment rendering for now.
  // const findComment = (questionId: string) => {
  //   // Logic to find comment based on responseData structure
  //   return null; // Or implement actual search if comments are included
  // };

  // Helper function to render answer based on question type
  const renderAnswer = (
    questionId: string,
    type: string,
    questionText: string,
    answer: any // Accept any type for the answer
  ) => {
    if (answer === null || answer === undefined || answer === "") {
      return (
        <div className="mt-2">
          <div className="text-sm text-gray-600 font-medium mb-2">Answer:</div>
          <p className="text-gray-500 italic bg-gray-100 p-3 rounded-lg border-l-2 border-gray-400">
            No answer provided
          </p>
        </div>
      );
    }

    if (type === "checkbox" && Array.isArray(answer)) {
      return (
        <div className="mt-2">
          <div className="text-sm text-primary font-medium mb-2">Answer:</div>
          <ul className="list-disc pl-5 text-gray-700 bg-blue-50 p-3 rounded-lg border-l-2 border-primary">
            {answer.map((item, index) => (
              <li key={index} className="mb-1">
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    // Handle text/paragraph answers and other types
    return (
      <div className="mt-2">
        <div className="text-sm text-primary font-medium mb-2">Answer:</div>
        <p className="text-gray-700 font-medium bg-blue-50 p-3 rounded-lg border-l-2 border-primary">
          {typeof answer === "object"
            ? JSON.stringify(answer)
            : answer?.toString() || ""}{" "}
          {/* Handle objects and ensure string */}
        </p>
      </div>
    );
  };

  // Helper function to render question type badge - Keep as is
  const renderQuestionTypeBadge = (type: string) => {
    const badgeClasses =
      {
        radio: "bg-blue-100 text-blue-700",
        select: "bg-purple-100 text-purple-700",
        checkbox: "bg-green-100 text-green-700",
        text: "bg-yellow-100 text-yellow-700",
        paragraph: "bg-orange-100 text-orange-700",
        file: "bg-red-100 text-red-700",
        table: "bg-indigo-100 text-indigo-700",
      }[type] || "bg-gray-100 text-gray-700";

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs uppercase font-medium ${badgeClasses}`}
      >
        {type}
      </span>
    );
  };

  // Need to parse the 'qns' string from the survey object to get the survey structure
  let surveyQuestions: any = {};
  try {
    if (survey?.qns && typeof survey.qns === "string") {
      surveyQuestions = JSON.parse(survey.qns);
    }
  } catch (parseError) {
    console.error("Error parsing survey questions JSON:", parseError);
    notifications.show({
      title: "Warning",
      message: "Could not parse survey question structure.",
      color: "yellow",
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 max-w-7xl mx-auto mb-16">
      {/* Header with gradient background */}
      <div className="flex items-center justify-between rounded-xl mb-8 bg-gradient-to-r from-[#005DE9] to-[#0546A8] p-5 text-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <IoArrowBack className="text-white" size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold">Response Details</h1>
            <p className="text-white/80 text-sm mt-1">
              Viewing response for {survey?.name}
            </p>
          </div>
        </div>
        {/* Mark as Reviewed Button - assuming this functionality is handled separately if needed */}
        {/* This part of the UI might need to be adapted based on how review status is handled */}
        <div>
          {reviewed ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full">
              <FiCheckCircle />
              <span>Reviewed</span>
            </div>
          ) : (
            // You might want to add a button here to mark as reviewed if the API supports it
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full">
              <FiClock />
              <span>Pending Review</span>
            </div>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Applicant Information */}
        <div className="bg-white rounded-xl border border-[#005DE930] p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#005DE920]">
              <FiUser size={20} className="text-primary" />
            </div>
            <h2 className="text-xl font-medium text-gray-800">
              Applicant Information
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-gray-600 w-24">Name:</span>
              <span className="font-medium text-gray-800 flex-1 text-right">
                {applicant?.name || "N/A"}
              </span>
            </div>
            {/* Display other applicant details if available in API response */}
            <div className="flex items-center">
              <span className="text-gray-600 w-24">Email:</span>
              <span className="font-medium text-gray-800 flex-1 text-right">
                {applicant?.email || "N/A"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-24">Phone:</span>
              <span className="font-medium text-gray-800 flex-1 text-right">
                {applicant?.phone || "N/A"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-24">Submitted At:</span>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <FiClock size={16} className="text-primary" />
                <span className="font-medium text-gray-800">
                  {submitted_at
                    ? format(new Date(submitted_at), "MMM dd, yyyy HH:mm")
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Survey Information */}
        <div className="bg-white rounded-xl border border-[#005DE930] p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#005DE920]">
              <FiFileText size={20} className="text-primary" />
            </div>
            <h2 className="text-xl font-medium text-gray-800">
              Survey Information
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-gray-600 w-24">Survey Name:</span>
              <span className="font-medium text-gray-800 flex-1 text-right">
                {survey?.name || "N/A"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-24">Description:</span>
              <span className="font-medium text-gray-800 flex-1 text-right">
                {/* Display the description of the first section, or fallback to survey description or N/A */}
                {surveyQuestions && Object.keys(surveyQuestions).length > 0
                  ? (
                      Object.values(surveyQuestions)[0] as {
                        description?: string;
                      }
                    )?.description ||
                    survey?.description ||
                    "N/A"
                  : survey?.description || "N/A"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-24">Status:</span>
              <span className="font-medium text-gray-800 flex-1 text-right">
                {survey?.survey_status || "N/A"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-24">Created At:</span>
              <span className="font-medium text-gray-800 flex-1 text-right">
                {survey?.created_at
                  ? format(new Date(survey.created_at), "MMM dd, yyyy")
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-24">Expiry Date:</span>
              <span className="font-medium text-gray-800 flex-1 text-right">
                {survey?.expiry_date
                  ? format(new Date(survey.expiry_date), "MMM dd, yyyy")
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Survey Answers Section */}
      <div className="bg-white rounded-xl border border-[#005DE930] p-6 hover:shadow-md transition-shadow mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#005DE920]">
            <BsClipboardCheck size={20} className="text-primary" />
          </div>
          <h2 className="text-xl font-medium text-gray-800">Survey Answers</h2>
        </div>
        {/* Render questions based on parsed survey structure */}
        {surveyQuestions &&
          Object.keys(surveyQuestions).map((pageKey) => {
            const page = surveyQuestions[pageKey];
            if (!page || !page.pages) return null;

            return page.pages.map((pageContent: any, pageIndex: number) => {
              if (!pageContent || !pageContent.surveys) return null; // 'surveys' here actually means questions in your structure

              return pageContent.surveys.map(
                (question: any, questionIndex: number) => (
                  <div
                    key={`${pageKey}-${pageIndex}-${questionIndex}`}
                    className="mb-6 p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-800">
                        {question.title}
                      </h3>
                      {renderQuestionTypeBadge(question.type)}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {question.description}
                    </p>

                    {/* Render the answer for this question */}
                    {renderAnswer(
                      question.id,
                      question.type,
                      question.title,
                      parsedAnswers ? parsedAnswers[question.id] : null // Pass the specific answer from parsedAnswers
                    )}

                    {/* Comment Section - Assuming comments are not part of this API payload */}
                    {/* You would need to fetch or handle comments separately if needed */}
                  </div>
                )
              );
            });
          })}
        {/* Display a message if no answers are recorded */}
        {(!rawAnswersString || rawAnswersString === "") &&
          !loading &&
          !error && (
            <div className="text-center text-gray-500">
              No answers recorded for this response.
            </div>
          )}
      </div>

      {/* Reviewed Information */}
      <div className="bg-white rounded-xl border border-[#005DE930] p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#005DE920]">
            <FiCheckCircle size={20} className="text-primary" />
          </div>
          <h2 className="text-xl font-medium text-gray-800">Review Status</h2>
        </div>
        <div className="flex items-center">
          <span className="text-gray-600 w-24">Status:</span>
          <span
            className={`font-medium flex-1 text-right ${reviewed ? "text-green-700" : "text-yellow-700"}`}
          >
            {reviewed ? "Reviewed" : "Pending"}
          </span>
        </div>
        {/* Display reviewedBy and reviewedAt if available in API response (not in the shared payload) */}
        {/* If you add these to the API response or fetch them separately, display them here */}
      </div>
    </div>
  );
};

export default ResponseDetailsPage;
