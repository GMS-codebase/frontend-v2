"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Tabs, Badge, Card, Text, Divider } from "@mantine/core";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // Hardcoded survey data based on ID
  const surveyData = {
    s1: {
      name: "Customer Satisfaction Survey",
      description: "Help us improve our services by sharing your feedback",
      applicants: 124,
      status: "ongoing",
      created_at: new Date("2023-04-15").toLocaleDateString(),
      expiry_date: new Date("2023-06-15").toLocaleDateString(),
      sections: [
        {
          name: "General Feedback",
          description: "Your overall experience with our service.",
          questions: [
            {
              id: "q1",
              title: "How satisfied are you with our service?",
              type: "radio",
              required: true,
              choices: [
                "Very Satisfied",
                "Satisfied",
                "Neutral",
                "Dissatisfied",
                "Very Dissatisfied",
              ],
            },
            {
              id: "q2",
              title: "How often do you use our service?",
              type: "select",
              required: true,
              choices: ["Daily", "Weekly", "Monthly", "Rarely", "First Time"],
            },
            {
              id: "q3",
              title: "Which of our features do you use most often?",
              type: "checkbox",
              required: true,
              choices: ["Feature A", "Feature B", "Feature C", "Feature D"],
            },
          ],
        },
        {
          name: "Product Quality",
          description: "Your feedback on the quality of our products.",
          questions: [
            {
              id: "q4",
              title: "How would you rate the quality of our product?",
              type: "radio",
              required: true,
              choices: [
                "Excellent",
                "Good",
                "Average",
                "Below Average",
                "Poor",
              ],
            },
            {
              id: "q5",
              title: "What aspects of our product could be improved?",
              type: "checkbox",
              required: true,
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
        {
          name: "Customer Support",
          description: "Your experience with our customer support team.",
          questions: [
            {
              id: "q6",
              title: "How would you rate our customer support?",
              type: "radio",
              required: true,
              choices: [
                "Excellent",
                "Good",
                "Average",
                "Below Average",
                "Poor",
              ],
            },
            {
              id: "q7",
              title: "How quickly did we respond to your inquiry?",
              type: "select",
              required: true,
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
    s2: {
      name: "Employee Feedback Form",
      description: "Share your thoughts about the work environment and culture",
      applicants: 45,
      status: "ongoing",
      created_at: new Date("2023-05-01").toLocaleDateString(),
      expiry_date: new Date("2023-07-01").toLocaleDateString(),
      sections: [
        {
          name: "Workplace Experience",
          description: "Feedback on your work environment and culture.",
          questions: [
            {
              id: "q1",
              title: "How would you rate the work-life balance?",
              type: "radio",
              required: true,
              choices: ["Excellent", "Good", "Fair", "Poor"],
            },
            {
              id: "q2",
              title: "How often do you feel stressed at work?",
              type: "select",
              required: true,
              choices: ["Never", "Rarely", "Sometimes", "Often", "Always"],
            },
            {
              id: "q3",
              title: "Which aspects of the workplace need improvement?",
              type: "checkbox",
              required: true,
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
        {
          name: "Professional Development",
          description: "Feedback on your growth and development opportunities.",
          questions: [
            {
              id: "q4",
              title: "How satisfied are you with your professional growth?",
              type: "radio",
              required: true,
              choices: [
                "Very Satisfied",
                "Satisfied",
                "Neutral",
                "Dissatisfied",
                "Very Dissatisfied",
              ],
            },
            {
              id: "q5",
              title: "What training opportunities would you like to see?",
              type: "checkbox",
              required: true,
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
  };

  // Get the survey based on ID or default to s1
  const survey = surveyData[id as keyof typeof surveyData] || surveyData.s1;

  // Add state for active section
  const [activeSection, setActiveSection] = useState(survey.sections[0].name);

  return (
    <div className="w-full !overflow-x-hidden p-6 max-w-7xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-500 mb-6 hover:underline font-medium"
      >
        <IoArrowBack size={18} /> Back to Surveys
      </button>

      <div className="bg-white rounded-lg shadow p-8 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            {survey.name}
          </h1>
          <span
            className={`px-3 py-1 rounded-sm text-xs font-medium uppercase tracking-wider ${
              survey.status === "ongoing"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {survey.status === "ongoing" ? "ONGOING" : "ENDED"}
          </span>
        </div>

        <p className="text-gray-600 mb-8">{survey.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-500 mb-4">
              Survey Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Status:</span>
                <span
                  className={`px-3 py-1 rounded-sm text-xs font-medium uppercase ${
                    survey.status === "ongoing"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {survey.status === "ongoing" ? "ONGOING" : "ENDED"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Created:</span>
                <span className="text-gray-900">{survey.created_at}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Expires:</span>
                <span className="text-gray-900">{survey.expiry_date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Applicants:</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-sm text-sm">
                  {survey.applicants}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Sections:</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-sm text-sm">
                  {survey.sections.length}
                </span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-500 mb-4">
              Response Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Completion Rate:</span>
                <span className="text-green-600 font-medium">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Average Time to Complete:</span>
                <span className="text-gray-900">5 minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Most Active Day:</span>
                <span className="text-gray-900">Monday</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Last Response:</span>
                <span className="text-gray-900">1 day ago</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Sections & Questions
        </h2>

        <div className="mb-8">
          <div className="flex border-b mb-6">
            {survey.sections.map((section, index) => (
              <button
                key={section.name}
                onClick={() => setActiveSection(section.name)}
                className={`px-4 py-2 font-medium ${
                  activeSection === section.name
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>

          {survey.sections.map((section) => {
            // Only render the active section
            if (activeSection !== section.name) return null;

            return (
              <div key={section.name}>
                <p className="text-gray-600 mb-4">{section.description}</p>
                <h3 className="text-xl font-medium text-gray-800 mb-4">
                  Questions
                </h3>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Question
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Required
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Options
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {section.questions.map((question) => (
                        <tr key={question.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {question.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {question.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs uppercase font-semibold rounded-sm ${
                                question.type === "radio"
                                  ? "bg-blue-100 text-blue-800"
                                  : question.type === "checkbox"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {question.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {question.required ? "Yes" : "No"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                            {question.choices.join(", ")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
