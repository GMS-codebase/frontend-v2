import React, { useState, useEffect } from "react";
import { Survey, ConditionalLogic } from "@/types/surveys-form";
import { useSurveyContext } from "@/contexts/SurveyContext";
import { shouldShowQuestion } from "@/utils/surveyConditionalLogic";

/**
 * Demo component to showcase conditional logic functionality
 * This is for demonstration purposes only
 */
const ConditionalLogicDemo: React.FC = () => {
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const { getQuestionById } = useSurveyContext();

  // Get the dependent question title for display
  const getDependentQuestionTitle = (questionId: string) => {
    const dependentQuestion = getQuestionById(questionId);
    return dependentQuestion?.title || `Question ${questionId}`;
  };

  // Sample questions with conditional logic
  const sampleQuestions: Survey[] = [
    {
      id: "q1",
      title: "Do you have children?",
      description: "Please select yes or no",
      type: "radio",
      required: true,
      commentable: false,
      name: "children",
      survey_TYPE: "demo",
      choices: ["Yes", "No"],
    },
    {
      id: "q2",
      title: "How many children do you have?",
      description: "Please enter the number of children",
      type: "number",
      required: true,
      commentable: false,
      name: "children_count",
      survey_TYPE: "demo",
      conditionalLogic: {
        enabled: true,
        dependsOn: "q1",
        showWhen: {
          operator: "equals",
          value: "Yes",
        },
      },
    },
    {
      id: "q3",
      title: "What is your age?",
      description: "Please enter your age in years",
      type: "number",
      required: true,
      commentable: false,
      name: "age",
      survey_TYPE: "demo",
    },
    {
      id: "q4",
      title: "Are you eligible for senior discounts?",
      description: "This question appears for people 65 and older",
      type: "radio",
      required: false,
      commentable: false,
      name: "senior_discount",
      survey_TYPE: "demo",
      choices: ["Yes", "No", "Not sure"],
      conditionalLogic: {
        enabled: true,
        dependsOn: "q3",
        showWhen: {
          operator: "greater_than",
          value: "65",
        },
      },
    },
    {
      id: "q5",
      title: "Which programming languages do you know?",
      description: "Select all that apply",
      type: "checkbox",
      required: true,
      commentable: false,
      name: "programming_languages",
      survey_TYPE: "demo",
      choices: ["JavaScript", "Python", "Java", "C++", "Other"],
    },
    {
      id: "q6",
      title: "How many years of JavaScript experience do you have?",
      description: "Please enter your experience in years",
      type: "number",
      required: false,
      commentable: false,
      name: "javascript_experience",
      survey_TYPE: "demo",
      conditionalLogic: {
        enabled: true,
        dependsOn: "q5",
        showWhen: {
          operator: "contains",
          value: "JavaScript",
        },
      },
    },
  ];

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const renderQuestion = (question: Survey) => {
    const shouldShow = showAllQuestions || shouldShowQuestion(question, answers, sampleQuestions);

    if (!shouldShow) {
      return (
        <div key={question.id} className="p-4 bg-gray-100 rounded-lg border-l-4 border-l-gray-400">
          <p className="text-gray-500 italic">
            <strong>{question.title}</strong> - Hidden (conditional logic not met)
          </p>
          {question.conditionalLogic && (
            <p className="text-xs text-gray-400 mt-1">
              Shows when: &quot;{getDependentQuestionTitle(question.conditionalLogic.dependsOn)}&quot; {question.conditionalLogic.showWhen.operator} &quot;{question.conditionalLogic.showWhen.value}&quot;
            </p>
          )}
        </div>
      );
    }

    return (
      <div key={question.id} className="p-4 bg-white rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-2">{question.title}</h3>
        {question.description && (
          <p className="text-sm text-gray-600 mb-3">{question.description}</p>
        )}
        
        {question.conditionalLogic && (
          <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-blue-700">
              <strong>Conditional:</strong> Shows when &quot;{getDependentQuestionTitle(question.conditionalLogic.dependsOn)}&quot; {question.conditionalLogic.showWhen.operator} &quot;{question.conditionalLogic.showWhen.value}&quot;
            </p>
          </div>
        )}

        {question.type === "radio" && (
          <div className="space-y-2">
            {question.choices?.map((choice) => (
              <label key={choice} className="flex items-center">
                <input
                  type="radio"
                  name={question.id}
                  value={choice}
                  checked={answers[question.id] === choice}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="mr-2"
                />
                {choice}
              </label>
            ))}
          </div>
        )}

        {question.type === "checkbox" && (
          <div className="space-y-2">
            {question.choices?.map((choice) => (
              <label key={choice} className="flex items-center">
                <input
                  type="checkbox"
                  value={choice}
                  checked={answers[question.id]?.includes(choice) || false}
                  onChange={(e) => {
                    const currentValues = answers[question.id] || [];
                    if (e.target.checked) {
                      handleAnswerChange(question.id, [...currentValues, choice]);
                    } else {
                      handleAnswerChange(question.id, currentValues.filter((v:any) => v !== choice));
                    }
                  }}
                  className="mr-2"
                />
                {choice}
              </label>
            ))}
          </div>
        )}

        {question.type === "number" && (
          <input
            type="number"
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your answer..."
          />
        )}

        {question.required && (
          <p className="text-xs text-red-500 mt-1">* Required</p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Conditional Logic Demo</h1>
        <p className="text-gray-600 mb-4">
          This demo shows how conditional logic works in surveys. Questions are automatically shown or hidden based on your answers to previous questions.
        </p>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowAllQuestions(!showAllQuestions)}
            className={`px-4 py-2 rounded-lg ${
              showAllQuestions 
                ? "bg-gray-500 text-white" 
                : "bg-blue-500 text-white"
            }`}
          >
            {showAllQuestions ? "Show Conditional View" : "Show All Questions"}
          </button>
          
          <button
            onClick={() => setAnswers({})}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Clear All Answers
          </button>
        </div>

        {showAllQuestions && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Debug Mode:</strong> All questions are visible. In normal mode, questions with conditional logic would be hidden until their conditions are met.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {sampleQuestions.map(renderQuestion)}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Current Answers:</h3>
        <pre className="text-sm text-gray-600 bg-white p-3 rounded border overflow-auto">
          {JSON.stringify(answers, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ConditionalLogicDemo;

