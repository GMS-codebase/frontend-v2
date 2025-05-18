"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { format } from "date-fns";
import { FiCheckCircle, FiClock, FiFileText, FiUser, FiMail, FiPhone, FiCalendar } from "react-icons/fi";
import { BsClipboardCheck } from "react-icons/bs";

const ResponseDetailsPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  
  // Hardcoded mock data for a customer satisfaction survey response
  const responseData = {
    uuid: id,
    applicant: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+250 789 123 456",
      submitted: "May 10, 2023 14:30",
    },
    survey: {
      name: "Customer Satisfaction Survey",
      description: "Help us improve our services by sharing your feedback",
      status: "Ongoing",
      created_at: "Apr 15, 2023",
      expiry_date: "Jun 15, 2023",
    },
    reviewed: true,
    reviewedBy: "Admin User",
    reviewedAt: "May 11, 2023 10:15",
    sections: [
      {
        name: "General Feedback",
        description: "Your overall experience with our service.",
        questions: [
          {
            id: "q1",
            title: "How satisfied are you with our service?",
            type: "radio",
            answer: "Very Satisfied",
          },
          {
            id: "q2",
            title: "How often do you use our service?",
            type: "select",
            answer: "Weekly",
          },
          {
            id: "q3",
            title: "Which of our features do you use most often?",
            type: "checkbox",
            answer: ["Feature A", "Feature C"],
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
            answer: "Excellent",
          },
          {
            id: "q5",
            title: "What aspects of our product could be improved?",
            type: "checkbox",
            answer: ["Design", "Price"],
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
            answer: "Good",
          },
          {
            id: "q7",
            title: "How quickly did we respond to your inquiry?",
            type: "select",
            answer: "Same day",
          },
        ],
      },
    ],
    comments: [
      {
        id: "c1",
        question_id: "q1",
        text: "The service exceeded my expectations in most areas.",
        timestamp: "May 10, 2023 14:32",
      },
      {
        id: "c2",
        question_id: "q5",
        text: "Pricing could be more competitive compared to similar services.",
        timestamp: "May 10, 2023 14:35",
      },
    ],
  };

  // Helper function to render answer based on question type
  const renderAnswer = (type: string, answer: any) => {
    if (type === "checkbox" && Array.isArray(answer)) {
      return (
        <div className="mt-2">
          <div className="text-sm text-primary font-medium mb-2">Answer:</div>
          <ul className="list-disc pl-5 text-gray-700 bg-blue-50 p-3 rounded-lg border-l-2 border-primary">
            {answer.map((item, index) => (
              <li key={index} className="mb-1">{item}</li>
            ))}
          </ul>
        </div>
      );
    }
    return (
      <div className="mt-2">
        <div className="text-sm text-primary font-medium mb-2">Answer:</div>
        <p className="text-gray-700 font-medium bg-blue-50 p-3 rounded-lg border-l-2 border-primary">{answer}</p>
      </div>
    );
  };

  // Helper function to render question type badge
  const renderQuestionTypeBadge = (type: string) => {
    const badgeClasses = {
      radio: "bg-blue-100 text-blue-700",
      select: "bg-purple-100 text-purple-700",
      checkbox: "bg-green-100 text-green-700",
      text: "bg-yellow-100 text-yellow-700",
      paragraph: "bg-orange-100 text-orange-700",
      file: "bg-red-100 text-red-700",
      table: "bg-indigo-100 text-indigo-700",
    }[type] || "bg-gray-100 text-gray-700";
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs uppercase font-medium ${badgeClasses}`}>
        {type}
      </span>
    );
  };

  // Find comment for a specific question
  const findComment = (questionId: string) => {
    return responseData.comments.find((comment) => comment.question_id === questionId);
  };

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
            <p className="text-white/80 text-sm mt-1">Viewing response for {responseData.survey.name}</p>
          </div>
        </div>
        <div>
          {responseData.reviewed ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full">
              <FiCheckCircle />
              <span>Reviewed</span>
            </div>
          ) : (
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-full hover:bg-white/90 transition-colors">
              <FiCheckCircle />
              <span>Mark as Reviewed</span>
            </button>
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
            <h2 className="text-xl font-medium text-gray-800">Applicant Information</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-gray-600 w-24">Name:</span>
              <span className="font-medium text-gray-800 flex-1 text-right">{responseData.applicant.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-24">Email:</span>
              <span className="font-medium text-gray-800 flex-1 text-right">{responseData.applicant.email}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-24">Phone:</span>
              <span className="font-medium text-gray-800 flex-1 text-right">{responseData.applicant.phone}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-24">Submitted:</span>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <FiClock size={16} className="text-primary" />
                <span className="font-medium text-gray-800">{responseData.applicant.submitted}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Survey Information */}
        <div className="bg-white rounded-xl border border-[#005DE930] p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#005DE920]">
              <BsClipboardCheck size={20} className="text-primary" />
            </div>
            <h2 className="text-xl font-medium text-gray-800">Survey Information</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-gray-600 w-24">Survey:</span>
              <span className="font-medium text-gray-800 flex-1 text-right">{responseData.survey.name}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-24">Status:</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex-1 text-right max-w-fit ml-auto">
                {responseData.survey.status}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-24">Created:</span>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <FiCalendar size={16} className="text-primary" />
                <span className="font-medium text-gray-800">{responseData.survey.created_at}</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 w-24">Expires:</span>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <FiCalendar size={16} className="text-primary" />
                <span className="font-medium text-gray-800">{responseData.survey.expiry_date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Response Content by Section */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3 border-b pb-3">
        <span className="h-8 w-2 bg-primary rounded-full"></span>
        Response Details
      </h2>
      
      {/* Section navigation */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 min-w-max">
          {responseData.sections.map((section, idx) => (
            <button
              key={idx}
              onClick={() => document.getElementById(`section-${idx}`)?.scrollIntoView({ behavior: 'smooth' })}
              className="px-4 py-2 bg-white border border-[#005DE930] rounded-full hover:bg-[#005DE910] transition-colors text-gray-700 font-medium flex items-center gap-2"
            >
              <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-bold">
                {idx + 1}
              </span>
              {section.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-8">
        {responseData.sections.map((section, sIndex) => (
          <div id={`section-${sIndex}`} key={sIndex} className="bg-white rounded-xl border border-[#005DE930] p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-bold">
                {sIndex + 1}
              </div>
              <h3 className="text-lg font-semibold text-primary">{section.name}</h3>
            </div>
            <p className="text-gray-600 mb-6 border-l-4 border-[#005DE950] pl-3 italic">{section.description}</p>
            
            <div className="space-y-6">
              {section.questions.map((question, qIndex) => {
                const comment = findComment(question.id);
                return (
                  <div key={question.id} className="border border-[#005DE920] rounded-lg p-5 last:mb-0 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-800 flex-1">
                        <span className="text-primary font-bold mr-2">{sIndex + 1}.{qIndex + 1}</span> 
                        {question.title}
                      </h4>
                      {renderQuestionTypeBadge(question.type)}
                    </div>
                    {renderAnswer(question.type, question.answer)}
                    
                    {comment && (
                      <div className="mt-4 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                        <div className="flex justify-between mb-2">
                          <h5 className="text-sm font-medium text-yellow-700">Additional Comment</h5>
                          <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Review Information */}
      {responseData.reviewed && (
        <div className="mt-8 bg-gradient-to-r from-[#005DE910] to-[#0546A810] rounded-xl p-6 border border-[#005DE930]">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white">
              <FiFileText size={20} />
            </div>
            <h2 className="text-xl font-medium text-gray-800">Review Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center bg-white p-3 rounded-lg">
              <span className="text-gray-600 mr-2">Reviewed By:</span>
              <span className="font-medium text-gray-800 flex-1 text-right">{responseData.reviewedBy}</span>
            </div>
            <div className="flex items-center bg-white p-3 rounded-lg">
              <span className="text-gray-600 mr-2">Reviewed At:</span>
              <div className="flex items-center gap-2 ml-auto">
                <FiClock size={16} className="text-primary" />
                <span className="font-medium text-gray-800">{responseData.reviewedAt}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseDetailsPage; 