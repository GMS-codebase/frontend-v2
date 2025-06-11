"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/Card";
import { CiEdit } from "react-icons/ci";
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

const SurveyResponsePage = () => {
  const params = useParams();
  const surveyId = params.surveyId as string;
  const applicantId = params.applicantId as string;

  const [response, setResponse] = useState<SurveyResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        setLoading(true);
        const response = await authorizedApi.get(
          `/api/v2/survey/survey-response/${surveyId}/${applicantId}`
        );

        // Process the response data
        const processedResponse = {
          uuid: response.data.id,
          applicant: {
            uuid: response.data.applicant.id,
            name: response.data.applicant.name,
          },
          survey: {
            id: response.data.survey.id,
            name: response.data.survey.name,
            qns: response.data.survey.qns,
          },
          answers: response.data.answers,
          submitted_at: response.data.submitted_at,
          reviewed: response.data.reviewed || false,
        };

        setResponse(processedResponse);
      } catch (error) {
        console.error("Error fetching response:", error);
        notifications.show({
          message: "Failed to load survey response",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResponse();
  }, [surveyId, applicantId]);

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

  // Handle marking as reviewed
  const handleMarkAsReviewed = async () => {
    try {
      await authorizedApi.put(
        `/api/v2/survey/survey-response/${surveyId}/${applicantId}/mark-reviewed`
      );

      setResponse((prev) => (prev ? { ...prev, reviewed: true } : null));

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

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Response Not Found
          </h1>
          <p className="text-gray-600">
            The requested survey response could not be found.
          </p>
        </div>
      </div>
    );
  }

  const questionMap = parseQuestions(response.survey.qns);
  const answers = parseAnswers(response.answers, questionMap);

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Add Go Back Button */}
      <div className="mb-6">
        <Link
          href={`/admin/surveys/responses?surveyId=${surveyId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <IoArrowBack className="w-5 h-5" />
          <span>Back to Responses</span>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Survey Response Details
        </h1>
        {!response.reviewed && (
          <button
            onClick={handleMarkAsReviewed}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <CiEdit className="w-4 h-4" />
            Mark as Reviewed
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Response Information Card */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Response Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Applicant Name
                    </p>
                    <p className="mt-1 text-base text-gray-900">
                      {response.applicant.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Survey Name
                    </p>
                    <p className="mt-1 text-base text-gray-900">
                      {response.survey.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Submitted At
                    </p>
                    <p className="mt-1 text-base text-gray-900">
                      {format(
                        new Date(response.submitted_at),
                        "MMM dd, yyyy HH:mm"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p
                      className={`mt-1 inline-block px-3 py-1 rounded-full text-sm ${
                        response.reviewed
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {response.reviewed ? "Reviewed" : "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers Card */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Survey Answers
            </h2>
            <div className="space-y-6">
              {answers.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-4 last:border-0"
                >
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    {item.question}
                  </p>
                  <p className="text-base text-gray-900">{item.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SurveyResponsePage;
