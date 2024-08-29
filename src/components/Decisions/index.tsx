import { useState } from "react";
import { SolarEyeLinear } from "../core/icons";
import Project from "@/components/ApplicantDetails/Project";
import IndicativeBudget from "@/components/ApplicantDetails/IndicativeBudget";
import EvalDetails from "@/components/Modals/evalDetails";
import EditEvalModal from "@/components/Modals/EditEvalModal";
import DueDetail from "@/components/Modals/Duediligency";
import DecisionDetails from "@/components/Modals/DecisionDetails";
import DueDetails from "@/components/Modals/DueDiigence";

const MakeDecisions = () => {
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

      {/* <DueDetails
        isOpenAddDue={isOpenAddDue}
        closeAddDue={closeAddDue}
        onMakeDecision={() => handleDecisionMade("DueDiligence")}
      /> */}
      {/* <EvalDetails
        isOpenAddEval={isOpenAddEval}
        closeAddEval={closeAddEval}
        onMakeDecision={() => handleDecisionMade("Evaluation")}
        openEditModal={openEditModal}
        applicationId={application}
      /> */}

      {isOpenEditEval && (
        <EditEvalModal
          isOpenEditEval={isOpenEditEval}
          closeEditEval={closeEditEval}
          formData={savedData}
          onUpdate={handleUpdate}
        />
      )}

      <DueDetails
        application={{}}
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

export default MakeDecisions;
