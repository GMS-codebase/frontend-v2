import React, { useState } from "react";
import QuestionsPage from "./QuestionsPage"; // Import the QuestionsPage component
import { QuestionForm } from "@/types/questions-form";

interface QuestionTypeProps {
  questionType: string;
  formData: QuestionForm;
  onChange: (updatedFormData: any) => void;
}

const QuestionType: React.FC<QuestionTypeProps> = ({
  questionType,
  formData,
  onChange,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = formData[questionType].pages;

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleAddPage = () => {
    const newPage = {
      questions: [],
    };

    const updatedFormData = {
      ...formData,
      [questionType]: {
        ...formData[questionType],
        pages: [...pages, newPage],
      },
    };

    onChange(updatedFormData);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-100 mb-4">
      <h3 className="text-lg font-semibold mb-2">
        Question Type: {questionType}
      </h3>
      <QuestionsPage
        pageIndex={currentPage}
        questionType={questionType}
        pageQuestions={pages[currentPage].questions}
        onChange={(updatedQuestions) => {
          const updatedPages = [...pages];
          updatedPages[currentPage].questions = updatedQuestions;
          const updatedFormData = {
            ...formData,
            [questionType]: {
              ...formData[questionType],
              pages: updatedPages,
            },
          };
          onChange(updatedFormData); // Update the form data from CreateForm
        }}
      />{" "}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className={`px-4 py-2 rounded-full ${
            currentPage === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-primary text-white"
          }`}
        >
          Prev
        </button>

        <span>
          Page {currentPage + 1} of {pages.length}
        </span>

        {currentPage === pages.length - 1 ? (
          <button
            onClick={handleAddPage}
            className="px-4 py-2 bg-primary text-white rounded-full"
          >
            Add Page
          </button>
        ) : (
          <button
            onClick={handleNextPage}
            disabled={currentPage === pages.length - 1}
            className={`px-4 py-2 rounded-full ${
              currentPage === pages.length - 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-primary text-white"
            }`}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionType;
