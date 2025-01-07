"use client";
import React, { useState } from "react";
import DonutChart from "../../../../components/chart/DonutChart";
import {
  SolarPen2Bold,
  SolarAddFolderBold,
  SolarShieldWarningBold,
  SolarClockSquareBold,
  SolarBookmarkBold,
  SolarCalendarBold,
  SolarSubtitlesBold,
  SolarDownloadMinimalisticBold,
} from "@/components/core/icons";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import ProgressCircle from "@/components/CallsList/ProgressBar";
import { useDisclosure } from "@mantine/hooks";
import CloseCallModal from "@/components/Modals/call/CloseCall";
import AddEditCall from "@/components/Modals/call/AddEditCall";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import CloseStageModal from "@/components/Modals/call/CloseStage";
import { Center } from "@mantine/core";
import OpenCloseAppealModal from "@/components/Modals/call/OpenCloseAppeal";
import { ApplicationStage } from "@/types/application";
const Page = () => {
  const { id: callId } = useParams();
  const calls = useSelector((state: any) => state.calls);
  const call = calls?.calls?.filter((call: any) => call?.uuid === callId)[0];
  const [openCloseAppeal, setOpenCloseAppeal] = useState({
    opened: false,
    stage: "",
    type: "",
  });
  const [isEditCall, { open: openEditCall, close: closeEditCall }] =
    useDisclosure(false);
  const [isCloseCall, { open: openCloseCall, close: closeCloseCall }] =
    useDisclosure(false);

  const startDate = call?.startDate ? new Date(call?.startDate) : null;
  const endDate = call?.endDate ? new Date(call?.endDate) : null;

  let callcloseDays = 0;
  if (
    startDate &&
    endDate &&
    !isNaN(startDate.getTime()) &&
    !isNaN(endDate.getTime())
  ) {
    const timeDifference = endDate.getTime() - startDate.getTime();
    callcloseDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  }
  const [closeStage, SetCloseStage] = useState({
    opened: false,
    stage: "",
  });

  const handleCloseStage = async (stage: string) => {
    authorizedApi
      .post(`/calls/close-stage`, { callId, stage })
      .then((res) => {
        notifications.show({
          title: "Closed Stage Successfully!",
          message: res.data.message,
        });
      })
      .catch((err) => {
        notifications.show({
          title: "Failed to close stage!",
          message: err.response.data.message,
        });
      });
  };
  if (calls.loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-600 text-sm">Loading....</p>
      </div>
    );
  }
  console.log(call);
  return (
    <div className="bg-white rounded-2xl p-10 ">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6  text-black">
          <div className="flex justify-between">
            <div className="text-xl font-bold">Call Info</div>
            <div className="flex items-center gap-2">
              <div
                className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4  py-2 items-center justify-center"
                onClick={openEditCall}
              >
                <span>
                  <SolarPen2Bold />
                </span>
                <div>Edit Call</div>
              </div>
              {call?.status !== "CLOSED" && (
                <div
                  className="flex gap-2 p-2 bg-danger rounded-full text-white px-4  py-2 items-center justify-center"
                  onClick={openCloseCall}
                >
                  <div>Close Call</div>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between w-3/5  font-semibold ">
                <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                  <span className="">
                    <SolarAddFolderBold />
                  </span>
                  <div>Title</div>
                </div>
              </div>
              <div className="flex gap-2 ">
                <div className="flex flex-col gap-6 justify-start items-start ">
                  <h1 className="font-bold text-xl">{call?.title}</h1>
                  <div className="flex gap-4 rounded-2xl items-center justify-center ">
                    <div className="flex gap-2  bg-gray-400 bg-opacity-10 rounded-full px-4  py-2 items-center justify-center font-semibold">
                      <span>
                        <SolarShieldWarningBold />
                      </span>
                      <div>Appeal Days</div>
                    </div>
                    <div className="text-xl font-bold">
                      {call?.appealDays} Days
                    </div>
                  </div>
                  <div className="flex gap-4 items-center justify-center ">
                    <div className="flex  gap-2  bg-gray-400 rounded-full bg-opacity-10 px-4  py-2 font-semibold items-center justify-center">
                      <span>
                        <SolarBookmarkBold />
                      </span>
                      <div>Status</div>
                    </div>
                    <div className="text-xl font-bold">{call?.status}</div>
                  </div>
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
              <div className="flex  gap-5">
                <div className="flex  ">
                  <ProgressCircle
                    activeColor="#005DE9"
                    bgColor="#fff"
                    baseColor="#EAEAFC"
                    endDate={call?.endDate}
                    startDate={call?.startDate}
                  />
                </div>
                <div className="flex flex-col  bg-[#005DE9]  bg-opacity-10 px-4 py-2 rounded-3xl items-center justify-center font-semibold gap-2">
                  <div className="flex gap-2 items-center justify-center">
                    <span className="text-[#005DE9]">
                      <SolarCalendarBold />
                    </span>
                    <div>
                      <p>Start date</p>
                      <p>{call && format(call?.startDate, "dd MMMM yyyy")}</p>
                    </div>
                  </div>

                  <div className="flex flex-row gap-2 items-center justify-center">
                    <span className="text-[#005DE9]">
                      <SolarCalendarBold />
                    </span>
                    <div>
                      <p>End Date</p>
                      <p>{call && format(call?.endDate, "dd MMMM yyyy")}</p>
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
              {call?.description}
            </div>
          </div>
          <div className="flex gap-2 text-[#005DE9] bg-[#005DE9] bg-opacity-10 px-4 py-2 rounded-full  w-fit font-bold items-center justify-center">
            <span>
              <SolarDownloadMinimalisticBold />
            </span>
            <p>View call attachment</p>
          </div>
          <div>
            <h1 className="mt-6 text-xl font-bold">Stages</h1>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex justify-between items-center bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                <h1>Evaluation Stage</h1>
                <button
                  disabled={call?.closedEvaluation}
                  onClick={() =>
                    SetCloseStage({
                      opened: true,
                      stage: ApplicationStage.EVALUATION,
                    })
                  }
                  className={`${call?.closedEvaluation ? "bg-green1 text-white " : ""} bg-danger text-white px-4 py-2 rounded-full`}
                >
                  {call?.closedEvaluation ? "Open" : "Close"}
                </button>
              </div>
              <div className="flex justify-between items-center bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                <h1>Due Diligency Stage</h1>

                <button
                  disabled={!call?.closedEvaluation}
                  onClick={() =>
                    SetCloseStage({
                      opened: true,
                      stage: ApplicationStage.DUE_DILIGENCY,
                    })
                  }
                  className={`${call?.closedDueDiligency ? "bg-green1 text-white " : ""} bg-danger text-white px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {call?.closedDueDiligency ? "Open" : "Close"}
                </button>
              </div>
              <div className="flex justify-between items-center bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                <h1>Grant Committee Stage</h1>
                <button
                  disabled={
                    !call?.closedDueDiligency || !call?.closedEvaluation
                  }
                  onClick={() =>
                    SetCloseStage({ opened: true, stage: "GRANT_COMMITTEE" })
                  }
                  className={`${call?.closedGrant ? "bg-green1 text-white " : ""} bg-danger text-white px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {call?.closedGrant ? "Open" : "Close"}
                </button>
              </div>
            </div>
          </div>
          <div>
            <h1 className="mt-6 text-xl font-bold">Open or Close Appeals</h1>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex justify-between items-center bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                <h1>Evaluation Stage</h1>
                <button
                  onClick={() =>
                    setOpenCloseAppeal({
                      opened: true,
                      stage: ApplicationStage.EVALUATION,
                      type: call?.evaluationAppealOpened ? "CLOSE" : "OPEN",
                    })
                  }
                  className={`${call?.evaluationAppealOpened ? "bg-green1 text-white " : ""} bg-danger text-white px-4 py-2 rounded-full`}
                >
                  {!call?.evaluationAppealOpened
                    ? "Open Appeal"
                    : "Close Appeal"}
                </button>
              </div>
              <div className="flex justify-between items-center bg-gray-400 bg-opacity-10 px-4 py-2 rounded-full">
                <h1>Due Diligency Stage</h1>
                <button
                  onClick={() =>
                    setOpenCloseAppeal({
                      opened: true,
                      stage: ApplicationStage.DUE_DILIGENCY,
                      type: call?.dueAppealOpened ? "CLOSE" : "OPEN",
                    })
                  }
                  className={`${call?.dueAppealOpened ? "bg-green1 text-white " : ""} bg-danger text-white px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {!call?.dueAppealOpened ? "Open Appeal" : "Close Appeal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CloseCallModal closeModal={closeCloseCall} isOpenModal={isCloseCall} />
      <CloseStageModal
        call={call}
        closeModal={() => SetCloseStage({ opened: false, stage: "" })}
        // isOpenModal={closeStage.status}
        data={closeStage}
      />
      <AddEditCall
        closeAddEditCall={closeEditCall}
        isOpenAddEditCall={isEditCall}
        defaultData={call}
      />
      <OpenCloseAppealModal
        callId={callId}
        closeModal={() =>
          setOpenCloseAppeal({ opened: false, stage: "", type: "" })
        }
        stage={
          openCloseAppeal.stage as
            | ApplicationStage.EVALUATION
            | ApplicationStage.DUE_DILIGENCY
        }
        type={openCloseAppeal.type as "OPEN" | "CLOSE"}
        opened={openCloseAppeal.opened}
      />
    </div>
  );
};

export default Page;
