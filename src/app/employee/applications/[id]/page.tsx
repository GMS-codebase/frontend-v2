"use client";
import React, { useState } from "react";
import IndicativeBudget from "@/components/ApplicantDetails/IndicativeBudget";
import {
  SolarFileBold,
  SolarFolder2Bold,
  SolarEyeLinear,
} from "@/components/core/icons";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { Comments } from "@/types";
import FundingQuestions from "@/components/Application/FundingQuestions";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import EvalDetails from "@/components/Modals/evalDetails";
import EditEvalModal from "@/components/Modals/EditEvalModal";
import DueDetail from "@/components/Modals/Duediligency";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const applications = useSelector((state: any) => state.applications);
  const application = applications?.applications?.filter(
    (application: any) => application.uuid === id
  )[0];
  console.log(application);
  const [loading, setLoading] = useState(false);

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

  const [currentComponent, setCurrentComponent] = useState<
    "Project" | "IndicativeBudget"
  >("Project");
  const [commentsData, setCommentsData] = useState<Comments>({
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
  });
  const renderComponent = () => {
    switch (currentComponent) {
      case "Project":
        return (
          <FundingQuestions
            data={application?.projectFunding}
            setComments={setCommentsData}
            comments={commentsData}
          />
        );
      case "IndicativeBudget":
        return <IndicativeBudget />;
      default:
        return null;
    }
  };

  const handleAddComments = async () => {
    setLoading(true);
    try {
      await authorizedApi.post(
        `/application/fillApplication/${id}`,
        commentsData
      );
      notifications.show({
        message: "Application filled successfully!",
        color: "blue",
      });
    } catch (err: any) {
      console.log(err.response);
      notifications.show({
        message: err.response?.data?.message ?? "Failed to submit the form!",
        color: "red",
      });
    }
    setLoading(false);
  };
  const handleUpdate = (updatedData: {
    title: string;
    description: string;
  }) => {
    setSavedData(updatedData);
  };
  const handleDecisionMade = (stage: "Evaluation" | "DueDiligence") => {
    if (stage === "Evaluation") {
      setShowEvaluationButtons(true);
      closeAddEval();
    } else if (stage === "DueDiligence") {
      setShowDueDiligenceButtons(true);
      closeAddDue();
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8 rounded-3xl">
      <div className="bg-white rounded-2xl gap-6 p-5">
        <div className="flex justify-between items-center">
          <h2 className="text-black font-semibold">Legal status</h2>
          <div className="flex justify-between items-center gap-2 px-4 py-2 bg-[#005DE9] rounded-full text-white w-fit">
            <span>
              <SolarFileBold />
            </span>
            <div>Export Applicant Details</div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-5">
          <div className="flex flex-col justify-start items-start gap-6 font-semibold">
            <div className="flex gap-6 justify-start items-start">
              <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
                Application number
              </p>
              <p>{application?.applicationNumber}</p>
            </div>
            <div className="flex gap-6 justify-start items-start font-semibold">
              <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
                Finished answering
              </p>
              <p>{application?.finishedAnswering === true ? "YES" : "NO"}</p>
            </div>
            <div className="flex gap-6 justify-start items-start">
              <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start">
                Submitted
              </p>
              <p>{application?.finishedAnswering === true ? "YES" : "NO"}</p>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-6 font-semibold">
            <div className="flex gap-6 justify-start items-start">
              <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                Call
              </p>
              <p>{application?.call.title}</p>
            </div>
            <div className="flex gap-6 justify-start items-start">
              <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                Window
              </p>
              <p>{application?.window.title}</p>
            </div>
            <div className="flex gap-6 justify-start items-start">
              <p className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                Application submission deadline
              </p>
              <p>2022/02.18 02:00:00</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-6">
          <div className="flex flex-col gap-4 font-semibold">
            <h2 className="bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full flex gap-2 justify-start items-start w-fit">
              Description
            </h2>
            <div>{application?.description}</div>
          </div>

          <div className="flex px-4 py-2 gap-2 bg-[#005DE9] rounded-full text-white items-center justify-start w-fit">
            <span>
              <SolarFolder2Bold />
            </span>
            <div className="">Apply for Appeal</div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 p-5">
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
      <DueDetail
        isOpenAddDue={isOpenAddDue}
        closeAddDue={closeAddDue}
        onMakeDecision={() => handleDecisionMade("DueDiligence")}
      />
      <EvalDetails
        applicationId={id}
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
    </div>
  );
};

export default Page;
