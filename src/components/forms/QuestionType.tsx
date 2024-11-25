import React, { useEffect, useState } from "react";
import QuestionsPage from "./QuestionsPage"; // Import the QuestionsPage component
import { QuestionForm } from "@/types/questions-form";

interface QuestionTypeProps {
  mode: "creating" | "viewing" | "answering" | "commenting";
  questionType: string;
  formData: QuestionForm;
  onChange: (updatedFormData: any) => void;
  answers?: { [key: string]: any };
  setAnswers?: (key: string, value: any) => void;
  comments?: { [key: string]: any };
  setComments?: (key: string, value: any) => void;
}

const QuestionType: React.FC<QuestionTypeProps> = ({
  mode,
  questionType,
  formData,
  onChange,
  answers,
  setAnswers,
  comments,
  setComments,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setCurrentPage(0);
  }, [questionType]);

  const pages = formData[questionType].pages;
  console.log(formData);

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
      ...formData[questionType],
      pages: [...pages, newPage],
    };

    onChange(updatedFormData);
    setCurrentPage(formData[questionType].pages.length - 1);
  };

  console.log(pages);

  return (
    <div>
      <QuestionsPage
        onAddPage={handleAddPage}
        answers={answers}
        setAnswers={setAnswers}
        comments={comments}
        setComments={setComments}
        mode={mode}
        pageIndex={currentPage}
        questionType={questionType}
        pageQuestions={pages[currentPage]?.questions}
        onChange={(updatedQuestions) => {
          const updatedPages = [...pages];
          updatedPages[currentPage].questions = updatedQuestions;
          console.log(updatedPages);
          onChange({
            ...formData[questionType],
            pages: updatedPages,
          });
        }}
      />{" "}
      <div className="flex items-center gap-2 justify-end mb-4">
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
          <>
            {mode === "creating" && (
              <button
                onClick={handleAddPage}
                className="px-4 py-2 bg-primary text-white rounded-full"
              >
                Add Page
              </button>
            )}
          </>
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
