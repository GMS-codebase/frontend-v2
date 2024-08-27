"use client";
import React, { useState } from "react";
import Questions from "@/components/Application/Questions";
import {
  indicativeBudgetQuestions,
  questions,
} from "@/utils/constants/questions";
import { SolarEyeLinear } from "@/components/core/icons";
import MakeDecisions from "@/components/Decisions";

const Page = () => {
  const [currentComponent, setCurrentComponent] = useState<
    "Project" | "IndicativeBudget"
  >("Project");
  const [data, setData] = useState<{ [key: string]: any }>();

  const renderComponent = () => {
    const filterQuestionsBySubWindows = (
      subWindows: { window: string; subWindow: string }[],
    ) => {
      return subWindows.map(({ window, subWindow }) => {
        //@ts-ignore
        return questions[window as any]?.[subWindow] || [];
      });
    };

    const filteredQuestions = filterQuestionsBySubWindows([
      { window: "window_1", subWindow: "subwindow_1" },
      { window: "window_2", subWindow: "subwindow_1" },
    ]);

    switch (currentComponent) {
      case "Project":
        return (
          <Questions questions={filteredQuestions} setQuestionsData={setData} />
        );
      case "IndicativeBudget":
        return (
          <Questions
            questions={[indicativeBudgetQuestions as any]}
            setQuestionsData={setData}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div className="w-full flex items-start justify-between">
      <div className="flex flex-col gap-4 w-[68%] bg-white p-4 rounded-2xl ">
        <div className="font-semibold text-2xl">Questions and answers</div>
        <div className="flex font-semibold">
          <div
            onClick={() => setCurrentComponent("Project")}
            className={`cursor-pointer w-1/2 ${
              currentComponent === "Project" ? "bg-[#005DE9] bg-opacity-10" : ""
            } h-16 flex items-center justify-center`}
          >
            Project Funding Application
          </div>
          <div
            onClick={() => setCurrentComponent("IndicativeBudget")}
            className={`cursor-pointer w-1/2 ${
              currentComponent === "IndicativeBudget"
                ? "bg-[#C50000] bg-opacity-10"
                : ""
            } h-16 flex items-center justify-center`}
          >
            Indicative Budget
          </div>
        </div>
        <div className="w-full">{renderComponent()}</div>
        <div className="w-full flex justify-center mt-4 space-x-4">
          <button
            type="button"
            // onClick={prevStep}
            className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Finish Evaluation
          </button>
        </div>
      </div>
      <MakeDecisions/>
    </div>
  );
};
export default Page;
