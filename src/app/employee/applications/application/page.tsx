"use client";
import React, { useState } from "react";
import Project from "@/components/ApplicantDetails/Project";
import IndicativeBudget from "@/components/ApplicantDetails/IndicativeBudget";
import EvalDetails from "@/components/Modals/evalDetails";
import EditEvalModal from "@/components/Modals/EditEvalModal";
import DueDetail from "@/components/Modals/Duediligency";
import DecisionDetails from "@/components/Modals/DecisionDetails";
import DueDetails from "@/components/Modals/DueDiigence";

const Page = () => {
  const [currentComponent, setCurrentComponent] = useState<
    "Project" | "IndicativeBudget"
  >("Project");

  const [isOpenAddDue, setIsOpenAddDue] = useState(false);
  const [isOpenAddEval, setIsOpenAddEval] = useState(false);
  const [isOpenEditEval, setIsOpenEditEval] = useState(false);
  const [savedData, setSavedData] = useState({ title: "", description: "" });

  // Separate states for showing decision buttons
  const [showEvaluationButtons, setShowEvaluationButtons] = useState(false);
  const [showDueDiligenceButtons, setShowDueDiligenceButtons] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const openAddDue = () => setIsOpenAddDue(true);
  const closeAddDue = () => setIsOpenAddDue(false);

  const openAddEval = () => setIsOpenAddEval(true);
  const closeAddEval = () => setIsOpenAddEval(false);

  const [isOpenAddDues, setIsOpenAddDues] = useState(false);
  const [isOpenAddEvals, setIsOpenAddEvals] = useState(false);

  const openAddDues = () => setIsOpenAddDues(true);
  const closeAddDues = () => setIsOpenAddDues(false);

  const openAddEvals = () => setIsOpenAddEvals(true);
  const closeAddEvals = () => setIsOpenAddEvals(false);

  const openEditModal = () => setIsOpenEditEval(true);
  const closeEditEval = () => setIsOpenEditEval(false);

  const handleDecisionMade = (stage: "Evaluation" | "DueDiligence") => {
    if (stage === "Evaluation") {
      setShowEvaluationButtons(true);
      closeAddEval();
    } else if (stage === "DueDiligence") {
      setShowDueDiligenceButtons(true);
      closeAddDue();
    }
  };

  const renderComponent = () => {
    switch (currentComponent) {
      case "Project":
        return (
          <Project
            data={undefined}
            setComments={function (value: any): void {
              throw new Error("Function not implemented.");
            }}
            commentsData={{
              titleComment: "",
              activitiesComment: "",
              readinessExecuteComment: "",
              roleComment: "",
              institutionComment: "",
              trainingManualComment: "",
              trainingEquipmentComment: "",
              identificationEmployeeComment: "",
              staffComment: "",
              sustainabilityComment: "",
              previousFinancialReportComment: "",
              trainingPremisesComment: "",
              contributionFromApplicantComment: "",
              recruitmentTrainerComment: "",
              MOUsAttachmentComment: "",
              identificationMemberComment: "",
              assessmentEquipmentComment: "",
              recruitmentCandidatesNumberComment: "",
              assessorsAndFacilitatorsComment: "",
              budgetAttachmentComment: "",
              contributionComment: "",
            }}
          />
        );
      case "IndicativeBudget":
        return <IndicativeBudget />;
      default:
        return null;
    }
  };

  const handleMakeDecision = () => {
    setSavedData({
      title: "decision1",
      description: "Initial decision details",
    });
    closeAddEval();
    setShowEvaluationButtons(true);
  };

  const handleUpdate = (updatedData: {
    title: string;
    description: string;
  }) => {
    setSavedData(updatedData);
  };

  const handleEditComment = () => {
    setIsEditing(true); // Enable editing mode
    openEditModal(); // Open the EditEvalModal
  };

  const handleSaveComment = (updatedText: string) => {
    setSavedData({ ...savedData, description: updatedText });
    setIsEditing(false); // Disable editing mode
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
            {!showEvaluationButtons && (
              <div
                onClick={openAddEval}
                className="flex gap-2 items-center justify-center bg-[#005DE9] text-white rounded-full px-2 py-2 w-full cursor-pointer"
              >
                <p>Make a decision</p>
              </div>
            )}
            {showEvaluationButtons && (
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={openAddEvals}
                  className="font-medium bg-[#005DE9] text-white w-full flex justify-center items-center gap-2 rounded-full px-4 py-2"
                >
                  View details
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold">Due Diligence Stage</h3>
            <div className="font-medium bg-red-400 bg-opacity-10 text-red-600 w-fit justify-start items-center rounded-full px-4 py-2">
              Pending
            </div>
            {!showDueDiligenceButtons && (
              <div
                onClick={openAddDue}
                className="flex gap-2 items-center justify-center bg-[#005DE9] text-white rounded-full px-2 py-2 w-full cursor-pointer"
              >
                <p>Make a decision</p>
              </div>
            )}
            {showDueDiligenceButtons && (
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={openAddDues}
                  className="font-medium bg-[#005DE9] text-white w-full flex justify-center items-center gap-2 rounded-full px-4 py-2"
                >
                  View details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <DueDetail
        isOpenAddDue={isOpenAddDue}
        closeAddDue={closeAddDue}
        onMakeDecision={() => handleDecisionMade("DueDiligence")}
      />
      <EvalDetails
        isOpenAddEval={isOpenAddEval}
        closeAddEval={closeAddEval}
        onMakeDecision={() => handleDecisionMade("Evaluation")}
        openEditModal={openEditModal}
      />

      {isOpenEditEval && (
        <EditEvalModal
          isOpenEditEval={isOpenEditEval}
          closeEditEval={closeEditEval}
          formData={savedData}
          onUpdate={handleUpdate}
        />
      )}

      <DueDetails
        opened={isOpenAddDues}
        close={closeAddDues}
        isEditing={isEditing}
        onSaveComment={handleSaveComment}
      />
      <DecisionDetails
        opened={isOpenAddEvals}
        close={closeAddEvals}
        isEditing={isEditing}
        onSaveComment={handleSaveComment}
      />
    </div>
  );
};
export default Page;
