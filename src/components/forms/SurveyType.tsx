import React, { useEffect, useState } from "react";
import SurveyPage from "./SurveyPage";
import { SurveyForm } from "@/types/surveys-form";

interface SurveyTypeProps {
  mode: "creating" | "viewing" | "answering" | "commenting";
  surveyType: string;
  formData: SurveyForm;
  onChange: (updatedFormData: any) => void;
  answers?: { [key: string]: any };
  setAnswers?: (key: string, value: any) => void;
  goToNext?: () => void;
  goToPrev?: () => void;
}

const SurveyType: React.FC<SurveyTypeProps> = ({
  mode,
  surveyType,
  formData,
  onChange,
  answers,
  setAnswers,
  goToNext,
  goToPrev,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setCurrentPage(0);
  }, [surveyType]);

  const pages = formData[surveyType].pages;

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      goToNext && goToNext();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    } else {
      goToPrev && goToPrev();
    }
  };

  const handleAddPage = () => {
    const newPage = {
      surveys: [],
    };

    const updatedFormData = {
      ...formData[surveyType],
      pages: [...pages, newPage],
    };

    onChange(updatedFormData);
    setCurrentPage(formData[surveyType].pages.length - 1);
  };

  return (
    <div>
      <SurveyPage
        onAddPage={handleAddPage}
        answers={answers}
        setAnswers={setAnswers}
        mode={mode}
        pageIndex={currentPage}
        surveyType={surveyType}
        pageSurveys={pages[currentPage]?.surveys}
        onChange={(updatedSurveys) => {
          const updatedPages = [...pages];
          updatedPages[currentPage].surveys = updatedSurveys;
          onChange({
            ...formData[surveyType],
            pages: updatedPages,
          });
        }}
      />{" "}
      <div className="flex items-center gap-2 justify-end mb-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0 && !goToPrev}
          className={`px-4 py-2 rounded-full ${
            currentPage === 0 && !goToPrev
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-primary text-white"
          }`}
        >
          Prev
        </button>

        <span>
          Page {currentPage + 1} of {pages.length}
        </span>

        {currentPage === pages.length - 1 && !goToNext ? (
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
            disabled={currentPage === pages.length - 1 && !goToNext}
            className={`px-4 py-2 rounded-full ${
              currentPage === pages.length - 1 && !goToNext
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

export default SurveyType;
