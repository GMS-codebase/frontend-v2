"use client";
import React, { useState } from "react";
import Questions from "@/components/Application/Questions";
import {
  indicativeBudgetQuestions,
  questions,
} from "@/utils/constants/questions";
import { SolarEyeLinear } from "@/components/core/icons";

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
      <div className="flex flex-col bg-white w-[30%] rounded-2xl p-5 gap-4">
        <h2 className="font-bold">Decision</h2>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">Evaluation Stage</h3>
          <div className="font-medium bg-[#4BC500] bg-opacity-10 text-[#4BC500] w-fit justify-start items-center rounded-full px-4 py-2">
            Proposal Approved
          </div>
          <div className="flex gap-2 items-center justify-center bg-[#005DE9] text-white rounded-full px-2 py-2 w-full">
            <span>
              <SolarEyeLinear />
            </span>
            <p>details</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-bold">DueDiligency Stage</h3>
          <div className="font-medium bg-[#C50000] bg-opacity-10 text-[#C50000] w-fit justify-start items-center rounded-full px-4 py-2">
            Proposal Rejected
          </div>
          <div className="flex gap-2 items-center justify-center bg-[#005DE9] text-white rounded-full px-2 py-2 w-full">
            <span>
              <SolarEyeLinear />
            </span>
            <p>details</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
