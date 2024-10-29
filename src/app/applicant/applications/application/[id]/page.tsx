"use client";
import React, { useState } from "react";
import {
  SolarAddFolderBold,
  SolarShieldWarningBold,
  SolarClockSquareBold,
  SolarBookmarkBold,
  SolarCalendarBold,
  SolarSubtitlesBold,
} from "@/components/core/icons";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import MinutesNegotiation from "@/components/Application/MinutesNegotiation";
import ProgressCircle from "@/components/CallsList/ProgressBar";
import FundingQuestions from "@/components/Application/FundingQuestions";
import BudgetQuestions from "@/components/Application/BudgetQuestions";
import EvaluationDetails from "@/components/Modals/EvaluationDetails";
import DueDiligencyDetails from "@/components/Modals/DueDiligencyDetails";
import { useDisclosure } from "@mantine/hooks";
const Page = () => {
  const { id: callId } = useParams();
  const calls = useSelector((state: any) => state.calls);
  const call = calls?.calls?.filter((call: any) => call.uuid === callId)[0];
  const { myApplications } = useSelector((state: any) => state.applications);
  const [currentComponent, setCurrentComponent] = useState<
    "Project" | "IndicativeBudget"
  >("Project");
  const application = myApplications.find((app: any) => app?.uuid === callId);
  const [
    isOpenEvaluationDetails,
    { open: openEvaluationDetails, close: closeEvaluationDetails },
  ] = useDisclosure(false);
  const [
    isOpenDueDiligencyDetails,
    { open: openDueDiligencyDetails, close: closeDueDiligencyDetails },
  ] = useDisclosure(false);
  const renderComponent = () => {
    switch (currentComponent) {
      case "Project":
        return (
          <FundingQuestions
            application={application}
            data={application?.projectFunding}
            comments={ application?.stages.find(
              (stage: any) => stage.stage === "EVALUATION"
            ).status ? application?.projectFunding:undefined}      
            goToBudget={() => setCurrentComponent("IndicativeBudget")}
          />
        );
      case "IndicativeBudget":
        return (
          <BudgetQuestions
            application={application as any}
            comments={application?.budget}
            data={application?.budget}
          />
        );
      default:
        return null;
    }
  };
  if (calls?.loading && !call) {
    return (
      <div className="w-full h-full flex items-center justify-center text-black">
        <p className="text-sm">Loading...</p>
      </div>
    );
  }
  return (
    <div className="space-y-6 ">
      <div className="bg-white rounded-2xl p-10 flex flex-col gap-6  text-black">
        <div className="flex justify-between">
          <div className="text-xl font-bold">Call Info</div>
          {/* <div
              onClick={handleDownloadInstructions}
              className="flex gap-2 text-[#005DE9] bg-[#005DE9] bg-opacity-10 px-4 py-2 rounded-full  w-fit font-bold items-center justify-center"
            >
              <span>
                <SolarDownloadMinimalisticBold />
              </span>
              <p>
                {loading
                  ? "Downloading . . ."
                  : "Download application instructions"}
              </p>
            </div> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <span className="">
                  <SolarAddFolderBold />
                </span>
                <div>Title</div>
              </div>
              <p className="text-xl font-bold">{application?.call?.title}</p>
            </div>
            <div className="flex gap-4 items-center ">
              <div className="flex gap-2  bg-gray-400 bg-opacity-10 rounded-full px-4  py-2 items-center justify-center font-semibold">
                <span>
                  <SolarShieldWarningBold />
                </span>
                <div>Appeal Days</div>
              </div>
              <div className="text-xl font-bold">
                {application?.call?.appealDays} Days
              </div>
            </div>
            <div className="flex gap-4 items-center  ">
              <div className="flex  gap-2  bg-gray-400 rounded-full bg-opacity-10 px-4  py-2 font-semibold items-center justify-center">
                <span>
                  <SolarBookmarkBold />
                </span>
                <div>Status</div>
              </div>
              <div className="text-xl font-bold">
                {application?.call?.status}
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="flex gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center w-fit ">
              <span className="">
                <SolarClockSquareBold />
              </span>
              <div>Timeline</div>
            </div>
            <div className="flex gap-4  ">
              <ProgressCircle
                activeColor="#005DE9"
                bgColor="#fff"
                baseColor="#EAEAFC"
                endDate={application?.call?.endDate}
                startDate={application?.call?.startDate}
              />
              <div className="flex flex-col  bg-[#005DE9]  bg-opacity-10 px-4   rounded-3xl items-center justify-center font-semibold gap-2">
                <div className="flex gap-2 items-center  w-full ">
                  <span className="text-[#005DE9]">
                    <SolarCalendarBold />
                  </span>
                  <div>
                    <p>Start date</p>
                    <p>
                      {application?.call &&
                        format(application?.call?.startDate, "dd MMMM yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row gap-2 items-center  w-full ">
                  <span className="text-[#005DE9]">
                    <SolarCalendarBold />
                  </span>
                  <div>
                    <p>End Date</p>
                    <p>
                      {application?.call &&
                        format(application?.call?.endDate, "dd MMMM yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex  gap-2  bg-gray-400 rounded-full bg-opacity-10 px-4  py-2 font-semibold w-fit items-center justify-center">
            <span>
              <SolarSubtitlesBold />
            </span>
            <p>Description</p>
          </div>
          <div className=" font-semibold text-gray-400">
            {application?.call?.description}
          </div>
        </div>
      </div>
      {application?.currentStage == "CONTRACT_SIGNING" ||
        (application?.currentStage === "FINISH_GRANT_APPROVAL" && (
          <MinutesNegotiation />
        ))}
      <div className={` w-full  flex gap-6`}>
        <div className="flex flex-col gap-4 w-full bg-white p-5 rounded-2xl">
          <div className="font-semibold text-2xl">Questions and answers</div>
          <div className="flex font-semibold">
            <div
              onClick={() => setCurrentComponent("Project")}
              className={`cursor-pointer w-1/2 transition-all duration-200 ${
                currentComponent === "Project"
                  ? "bg-[#005DE9] bg-opacity-10 text-primary border-b border-b-primary"
                  : ""
              } py-2.5  flex items-center justify-center`}
            >
              Project Funding Application
            </div>
            <div
              onClick={() => setCurrentComponent("IndicativeBudget")}
              className={`cursor-pointer w-1/2 transition-all duration-200  ${
                currentComponent === "IndicativeBudget"
                  ? "bg-[#005DE9] bg-opacity-10 text-primary border-b border-b-primary"
                  : ""
              } py-2.5  flex items-center justify-center`}
            >
              Indicative Budget
            </div>
          </div>
          <div className="mt-4 w-full">{renderComponent()}</div>
        </div>
        {application?.currentStage === "SUBMITTED" ? (
          <div></div>
        ) : (
          <div className="flex flex-col bg-white min-w-[30%] rounded-2xl p-5 gap-4">
            <h2 className="font-bold">Decision</h2>
            {application?.call.closedEvaluation && (
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">Evaluation Stage</h3>
                <div
                  className={`font-medium  ${
                    application?.stages.find(
                      (stage: any) => stage.stage === "EVALUATION"
                    ).status === "APPROVED"
                      ? "bg-[#4BC500] text-[#4BC500]"
                      : application?.status === "PENDING"
                        ? "bg-red-600 text-red-600"
                        : ""
                  } bg-opacity-10  w-fit justify-start items-center rounded-full px-4 py-2`}
                >
                  {
                    application?.stages.find(
                      (stage: any) => stage.stage === "EVALUATION"
                    ).status
                  }
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={openEvaluationDetails}
                    className="font-medium bg-[#005DE9] text-white w-full flex justify-center items-center gap-2 rounded-full px-4 py-2"
                  >
                    View details
                  </button>
                </div>
              </div>
            )}
            {application?.call.closedDueDiligency && (
              <div className="flex flex-col gap-2">
                <h3 className="font-bold">Due Diligence Stage</h3>
                <div
                  className={`font-medium  ${
                    application?.stages.find(
                      (stage: any) => stage.stage === "DUE_DILIGENCY"
                    ).status
                      ? "bg-[#4BC500] text-[#4BC500]"
                      : application?.status === "PENDING"
                        ? "bg-red-600 text-red-600"
                        : ""
                  } bg-opacity-10  w-fit justify-start items-center rounded-full px-4 py-2`}
                >
                  {
                    application?.stages.find(
                      (stage: any) => stage.stage === "DUE_DILIGENCY"
                    ).status
                  }
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={openDueDiligencyDetails}
                    className="font-medium bg-[#005DE9] text-white w-full flex justify-center items-center gap-2 rounded-full px-4 py-2"
                  >
                    View details
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <EvaluationDetails
        opened={isOpenEvaluationDetails}
        close={closeEvaluationDetails}
        evaluations={application?.evaluationDecisions || []}
        viewer="applicant"
      />
      <DueDiligencyDetails
        application={application}
        opened={isOpenDueDiligencyDetails}
        close={closeDueDiligencyDetails}
        viewer="applicant"
        decisions={application?.duediligencyDecisions}
      />
    </div>
  );
};

export default Page;
