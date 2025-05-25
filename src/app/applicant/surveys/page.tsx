"use client";
import React, { useEffect, useState } from "react";
import { Form as IForm } from "@/types/surveys-form";
import SurveyForms from "@/components/forms/SurveyForms";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { FiClock, FiCalendar, FiFileText, FiCheckCircle } from "react-icons/fi";
import { Button } from "@mantine/core";

const Page = () => {
  const [surveys, setSurveys] = useState<IForm[]>([
    {
      uuid: "s1",
      name: "Customer Satisfaction Survey",
      description: "Help us improve our services by sharing your feedback",
      qns: {
        "General Feedback": {
          name: "General Feedback",
          description: "Your overall experience with our service.",
          pages: [
            {
              surveys: [
                {
                  id: "General Feedback-q-0-0",
                  title: "How satisfied are you with our service?",
                  description: "Please rate your overall satisfaction",
                  type: "radio",
                  required: true,
                  commentable: true,
                  choices: [
                    "Very Satisfied",
                    "Satisfied",
                    "Neutral",
                    "Dissatisfied",
                    "Very Dissatisfied",
                  ],
                },
                {
                  id: "General Feedback-q-0-1",
                  title: "How often do you use our service?",
                  description: "Tell us about your usage frequency",
                  type: "select",
                  required: true,
                  commentable: true,
                  choices: [
                    "Daily",
                    "Weekly",
                    "Monthly",
                    "Rarely",
                    "First Time",
                  ],
                },
                {
                  id: "General Feedback-q-0-2",
                  title: "Which of our features do you use most often?",
                  description: "Select all that apply",
                  type: "checkbox",
                  required: true,
                  commentable: true,
                  choices: ["Feature A", "Feature B", "Feature C", "Feature D"],
                },
              ],
            },
          ],
        },
        "Product Quality": {
          name: "Product Quality",
          description: "Your feedback on the quality of our products.",
          pages: [
            {
              surveys: [
                {
                  id: "Product Quality-q-0-0",
                  title: "How would you rate the quality of our product?",
                  description: "Please rate the overall quality",
                  type: "radio",
                  required: true,
                  commentable: true,
                  choices: [
                    "Excellent",
                    "Good",
                    "Average",
                    "Below Average",
                    "Poor",
                  ],
                },
                {
                  id: "Product Quality-q-0-1",
                  title: "What aspects of our product could be improved?",
                  description: "Select all that apply",
                  type: "checkbox",
                  required: true,
                  commentable: true,
                  choices: [
                    "Durability",
                    "Design",
                    "Functionality",
                    "Price",
                    "Support",
                  ],
                },
              ],
            },
          ],
        },
        "Customer Support": {
          name: "Customer Support",
          description: "Your experience with our customer support team.",
          pages: [
            {
              surveys: [
                {
                  id: "Customer Support-q-0-0",
                  title: "How would you rate our customer support?",
                  description:
                    "Please rate your experience with our support team",
                  type: "radio",
                  required: true,
                  commentable: true,
                  choices: [
                    "Excellent",
                    "Good",
                    "Average",
                    "Below Average",
                    "Poor",
                  ],
                },
                {
                  id: "Customer Support-q-0-1",
                  title: "How quickly did we respond to your inquiry?",
                  description: "Select the timeframe",
                  type: "select",
                  required: true,
                  commentable: true,
                  choices: [
                    "Within 1 hour",
                    "Same day",
                    "1-2 days",
                    "More than 2 days",
                    "No response",
                  ],
                },
              ],
            },
          ],
        },
      },
      status: "ongoing",
      created_at: new Date("2023-04-15"),
      expiry_date: new Date("2023-06-15"),
    },
    {
      uuid: "s2",
      name: "Employee Feedback Form",
      description: "Share your thoughts about the work environment and culture",
      qns: {
        "Workplace Experience": {
          name: "Workplace Experience",
          description: "Feedback on your work environment and culture.",
          pages: [
            {
              surveys: [
                {
                  id: "Workplace Experience-q-0-0",
                  title: "How would you rate the work-life balance?",
                  description: "Please rate your overall work-life balance",
                  type: "radio",
                  required: true,
                  commentable: true,
                  choices: ["Excellent", "Good", "Fair", "Poor"],
                },
                {
                  id: "Workplace Experience-q-0-1",
                  title: "How often do you feel stressed at work?",
                  description: "Select the frequency of work-related stress",
                  type: "select",
                  required: true,
                  commentable: true,
                  choices: ["Never", "Rarely", "Sometimes", "Often", "Always"],
                },
                {
                  id: "Workplace Experience-q-0-2",
                  title: "Which aspects of the workplace need improvement?",
                  description: "Select all that apply",
                  type: "checkbox",
                  required: true,
                  commentable: true,
                  choices: [
                    "Communication",
                    "Resources",
                    "Training",
                    "Management",
                    "Work Environment",
                  ],
                },
              ],
            },
          ],
        },
        "Professional Development": {
          name: "Professional Development",
          description: "Feedback on your growth and development opportunities.",
          pages: [
            {
              surveys: [
                {
                  id: "Professional Development-q-0-0",
                  title: "How satisfied are you with your professional growth?",
                  description: "Please rate your career development",
                  type: "radio",
                  required: true,
                  commentable: true,
                  choices: [
                    "Very Satisfied",
                    "Satisfied",
                    "Neutral",
                    "Dissatisfied",
                    "Very Dissatisfied",
                  ],
                },
                {
                  id: "Professional Development-q-0-1",
                  title: "What training opportunities would you like to see?",
                  description: "Select all that interest you",
                  type: "checkbox",
                  required: true,
                  commentable: true,
                  choices: [
                    "Technical Skills",
                    "Leadership",
                    "Communication",
                    "Industry Certifications",
                    "Soft Skills",
                  ],
                },
              ],
            },
          ],
        },
      },
      status: "ongoing",
      created_at: new Date("2023-05-01"),
      expiry_date: new Date("2023-07-01"),
    },
    {
      uuid: "s3",
      name: "Product Evaluation Survey",
      description: "Your feedback helps us make better products",
      qns: {
        "Product Feedback": {
          name: "Product Feedback",
          description: "Your opinion on our current products.",
          pages: [
            {
              surveys: [
                {
                  id: "Product Feedback-q-0-0",
                  title: "How would you rate the product quality?",
                  description: "Please rate the overall quality",
                  type: "radio",
                  required: true,
                  commentable: true,
                  choices: ["Excellent", "Good", "Average", "Poor"],
                },
                {
                  id: "Product Feedback-q-0-1",
                  title: "How likely are you to recommend our product?",
                  description: "Rate your likelihood to recommend",
                  type: "select",
                  required: true,
                  commentable: true,
                  choices: [
                    "Very Likely",
                    "Likely",
                    "Neutral",
                    "Unlikely",
                    "Very Unlikely",
                  ],
                },
                {
                  id: "Product Feedback-q-0-2",
                  title: "Which features do you find most valuable?",
                  description: "Select all that apply",
                  type: "checkbox",
                  required: true,
                  commentable: true,
                  choices: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
                },
              ],
            },
          ],
        },
        "Future Improvements": {
          name: "Future Improvements",
          description: "Your ideas for future product development.",
          pages: [
            {
              surveys: [
                {
                  id: "Future Improvements-q-0-0",
                  title: "What new features would you like to see?",
                  description: "Select all that interest you",
                  type: "checkbox",
                  required: true,
                  commentable: true,
                  choices: [
                    "Integration with other tools",
                    "Mobile app",
                    "Advanced reporting",
                    "Customization options",
                  ],
                },
                {
                  id: "Future Improvements-q-0-1",
                  title: "How important is regular product updates to you?",
                  description: "Rate the importance",
                  type: "radio",
                  required: true,
                  commentable: true,
                  choices: [
                    "Very Important",
                    "Important",
                    "Neutral",
                    "Not Important",
                  ],
                },
              ],
            },
          ],
        },
      },
      status: "expired",
      created_at: new Date("2023-02-10"),
      expiry_date: new Date("2023-04-10"),
    },
    {
      uuid: "s4",
      name: "Website Usability Survey",
      description: "Help us improve your online experience",
      qns: {
        "Website Experience": {
          name: "Website Experience",
          description: "Your feedback on our website usability.",
          pages: [
            {
              surveys: [
                {
                  id: "Website Experience-q-0-0",
                  title: "How easy was it to navigate our website?",
                  description: "Rate the ease of navigation",
                  type: "radio",
                  required: true,
                  commentable: true,
                  choices: [
                    "Very Easy",
                    "Easy",
                    "Neutral",
                    "Difficult",
                    "Very Difficult",
                  ],
                },
                {
                  id: "Website Experience-q-0-1",
                  title: "How often do you visit our website?",
                  description: "Select your visit frequency",
                  type: "select",
                  required: true,
                  commentable: true,
                  choices: [
                    "Daily",
                    "Weekly",
                    "Monthly",
                    "Rarely",
                    "First Time",
                  ],
                },
                {
                  id: "Website Experience-q-0-2",
                  title: "Which features do you find most useful?",
                  description: "Select all that apply",
                  type: "checkbox",
                  required: true,
                  commentable: true,
                  choices: [
                    "Search",
                    "Navigation",
                    "Content",
                    "Design",
                    "Mobile View",
                  ],
                },
              ],
            },
          ],
        },
        Performance: {
          name: "Performance",
          description: "Your feedback on website performance.",
          pages: [
            {
              surveys: [
                {
                  id: "Performance-q-0-0",
                  title: "How would you rate the website loading speed?",
                  description: "Rate the performance",
                  type: "radio",
                  required: true,
                  commentable: true,
                  choices: [
                    "Very Fast",
                    "Fast",
                    "Average",
                    "Slow",
                    "Very Slow",
                  ],
                },
                {
                  id: "Performance-q-0-1",
                  title: "Have you experienced any technical issues?",
                  description: "Select all that apply",
                  type: "checkbox",
                  required: true,
                  commentable: true,
                  choices: [
                    "Broken links",
                    "Error messages",
                    "Payment issues",
                    "Login problems",
                    "None",
                  ],
                },
              ],
            },
          ],
        },
      },
      status: "ongoing",
      created_at: new Date("2023-03-20"),
      expiry_date: new Date("2023-05-20"),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<IForm | null>(null);
  const [surveyResponses, setSurveyResponses] = useState<Record<string, any>>(
    {}
  );
  const [completedSurveys, setCompletedSurveys] = useState<string[]>([]);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, any>>({});

  const handleSetAnswers = (key: string, value: any) => {
    setSurveyAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSurveySubmit = (surveyId: string) => {
    // Here you would normally send the answers to the server
    console.log("Survey answers:", surveyAnswers);

    setCompletedSurveys((prev) => [...prev, surveyId]);
    setSelectedSurvey(null);
    notifications.show({
      title: "Success",
      message: "Thank you for completing the survey!",
      color: "green",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (selectedSurvey) {
    return (
      <div className="w-full !overflow-x-hidden">
        <div className="flex items-center justify-between my-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedSurvey(null)}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Surveys
            </button>
            <h1 className="text-2xl font-bold">{selectedSurvey.name}</h1>
          </div>
          <Button
            onClick={() => handleSurveySubmit(selectedSurvey.uuid || "")}
            className="px-6 py-2"
            variant="filled"
            color="blue"
          >
            Submit Survey
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow p-8">
          <SurveyForms
            mode="answering"
            formData={selectedSurvey}
            answers={surveyAnswers}
            setAnswers={handleSetAnswers}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full !overflow-x-hidden">
      <div className="flex items-center justify-between my-4">
        <p className="text-2xl font-bold">Available Surveys</p>
      </div>
      {surveys.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No surveys available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {surveys.map((survey) => (
            <div
              key={survey.uuid}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6 relative"
            >
              <div className="absolute top-4 right-4">
                {completedSurveys.includes(survey.uuid || "") ? (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 flex items-center gap-1">
                    <FiCheckCircle /> Completed
                  </span>
                ) : (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      survey.status === "ongoing"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {(survey.status ?? "unknown").charAt(0).toUpperCase() +
                      (survey.status ?? "unknown").slice(1)}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">{survey.name}</h3>
                <p className="text-gray-600 text-sm">{survey.description}</p>
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-gray-400" />
                  <span>
                    Created: {survey.created_at?.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="text-gray-400" />
                  <span>
                    Expires: {survey.expiry_date?.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FiFileText className="text-gray-400" />
                  <span>{Object.keys(survey.qns).length} Sections</span>
                </div>
              </div>

              <Button
                onClick={() => setSelectedSurvey(survey)}
                className="w-full"
                variant="filled"
                color={
                  survey.status === "expired" ||
                  completedSurveys.includes(survey.uuid || "")
                    ? "gray"
                    : "blue"
                }
                disabled={
                  survey.status === "expired" ||
                  completedSurveys.includes(survey.uuid || "")
                }
              >
                {completedSurveys.includes(survey.uuid || "")
                  ? "Survey Completed"
                  : survey.status === "expired"
                    ? "Survey Expired"
                    : "Take Survey"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
