"use client";
import React, { useState } from "react";
import {
  SolarPen2Bold,
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
const Page = () => {
  const { id: callId } = useParams();
  const calls = useSelector((state: any) => state.calls);
  const call = calls?.calls?.filter((call: any) => call.uuid === callId)[0];
  const { myApplications } = useSelector((state: any) => state.applications);
  const [currentComponent, setCurrentComponent] = useState<
    "Project" | "IndicativeBudget"
  >("Project");
  const existingApplication = myApplications.find(
    (app: any) => app?.uuid === callId,
  );
  console.log("existing application --> ", existingApplication);
  const router = useRouter();
  const renderComponent = () => {
    switch (currentComponent) {
      case "Project":
        return (
          <FundingQuestions
            data={existingApplication?.projectFunding}
            goToBudget={() => setCurrentComponent("IndicativeBudget")}
          />
        );
      case "IndicativeBudget":
        return (
          <BudgetQuestions
            trades={existingApplication?.trades}
            data={existingApplication?.budget}
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
                  : "View application instructions"}
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
              <p className="text-xl font-bold">
                {existingApplication?.call?.title}
              </p>
            </div>
            <div className="flex gap-4 items-center ">
              <div className="flex gap-2  bg-gray-400 bg-opacity-10 rounded-full px-4  py-2 items-center justify-center font-semibold">
                <span>
                  <SolarShieldWarningBold />
                </span>
                <div>Appeal Days</div>
              </div>
              <div className="text-xl font-bold">
                {existingApplication?.call?.appealDays} Days
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
                {existingApplication?.call?.status}
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
                endDate={existingApplication?.call?.endDate}
                startDate={existingApplication?.call?.startDate}
              />
              <div className="flex flex-col  bg-[#005DE9]  bg-opacity-10 px-4   rounded-3xl items-center justify-center font-semibold gap-2">
                <div className="flex gap-2 items-center  w-full ">
                  <span className="text-[#005DE9]">
                    <SolarCalendarBold />
                  </span>
                  <div>
                    <p>Start date</p>
                    <p>
                      {existingApplication?.call &&
                        format(
                          existingApplication?.call?.startDate,
                          "dd MMMM yyyy",
                        )}
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
                      {existingApplication?.call &&
                        format(
                          existingApplication?.call?.endDate,
                          "dd MMMM yyyy",
                        )}
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
            {existingApplication?.call?.description}
          </div>
        </div>
      </div>
      <div className={` bg-white rounded-2xl  w-full  p-5`}>
        <div className="flex flex-col gap-4 w-full">
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
      </div>

      {existingApplication?.currentStage == "CONTRACT_SIGNING" ||
      existingApplication?.currentStage === "FINISH_GRANT_APPROVAL" ? (
        <MinutesNegotiation />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Page;
