"use client";
import React, { useState } from "react";
import Project from "@/components/ApplicantDetails/Project";
import IndicativeBudget from "@/components/ApplicantDetails/IndicativeBudget";
import EvalDetails from "@/components/Modals/evalDetails";
import DueDetail from "@/components/Modals/Duediligency";

const Page = () => {
  const [currentComponent, setCurrentComponent] = useState<
    "Project" | "IndicativeBudget"
  >("Project");

  const [isOpenAddDue, setIsOpenAddDue] = useState(false);
  const [isOpenAddEval, setIsOpenAddEval] = useState(false);
  const [showDecisionButtons, setShowDecisionButtons] = useState(false);

  const openAddDue = () => setIsOpenAddDue(true);
  const closeAddDue = () => setIsOpenAddDue(false);

  const openAddEval = () => {
    setIsOpenAddEval(true);
  };

  const closeAddEval = () => {
    setIsOpenAddEval(false);
  };

  // After decision is made, display the buttons on the page
  const handleDecisionMade = () => {
    setShowDecisionButtons(true);
    closeAddEval();
  };

  const renderComponent = () => {
    switch (currentComponent) {
      case "Project":
        return <Project />;
      case "IndicativeBudget":
        return <IndicativeBudget />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8 rounded-3xl">
      <div className="flex gap-2">
        <div className="flex bg-white rounded-2xl w-[70%] gap-4 p-5">
          <div className="flex flex-col gap-4 w-full">
            <div className="font-semibold text-2xl">Questions and answers</div>
            <div className="flex font-semibold">
              <div
                onClick={() => setCurrentComponent("Project")}
                className={`cursor-pointer w-1/2 ${
                  currentComponent === "Project"
                    ? "bg-[#005DE9] bg-opacity-10"
                    : ""
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
            <div className="mt-4 w-full">{renderComponent()}</div>
          </div>
        </div>
        <div className="flex flex-col bg-white w-[30%] rounded-2xl p-5 gap-4">
          <h2 className="font-bold">Decision</h2>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Evaluation Stage</h3>
            <div className="font-medium bg-[#4BC500] bg-opacity-10 text-[#4BC500] w-fit justify-start items-center rounded-full px-4 py-2">
              Pending
            </div>
            <div
              onClick={openAddEval}
              className="flex gap-2 items-center justify-center bg-[#005DE9] text-white rounded-full px-2 py-2 w-full cursor-pointer"
            >
              <p>Make a decision</p>
            </div>
            {showDecisionButtons && (
              <div className="flex flex-col gap-2 mt-4">
                <button className="hover:bg-green-500 hover:text-white text-green-500 border border-green-500 rounded-full px-4 py-2">
                  Edit Comment
                </button>
                <button className="bg-gray-200 text-black rounded-full px-4 py-2">
                  View Details
                </button>
                <button className="hover:bg-red-600 hover:text-white text-red-600 border border-red-600 rounded-full px-4 py-2">
                  Nullify Decision
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold">Due Diligence Stage</h3>
            <div className="font-medium bg-slate-00 bg-opacity-10 text-black w-fit justify-start items-center rounded-full px-4 py-2">
              Pending
            </div>
            <div
              onClick={openAddDue}
              className="flex gap-2 items-center justify-center bg-[#005DE9] text-white rounded-full px-2 py-2 w-full cursor-pointer"
            >
              <p>Make a decision</p>
            </div>
            {showDecisionButtons && (
              <div className="flex flex-col gap-2 mt-4">
                <button className="hover:bg-green-500 hover:text-white text-green-500 border border-green-500 rounded-full px-4 py-2">
                  Edit Comment
                </button>
                <button className="bg-gray-200 text-black rounded-full px-4 py-2">
                  View Details
                </button>
                <button className="hover:bg-red-600 hover:text-white text-red-600 border border-red-600 rounded-full px-4 py-2">
                  Nullify Decision
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <DueDetail
        isOpenAddDue={isOpenAddDue}
        closeAddDue={closeAddDue}
        onMakeDecision={handleDecisionMade}
      />
      <EvalDetails
        isOpenAddEval={isOpenAddEval} // Corrected prop name
        closeAddEval={closeAddEval} // Corrected prop name
        onMakeDecision={handleDecisionMade} // Corrected prop name
      />
    </div>
  );
};

export default Page;
