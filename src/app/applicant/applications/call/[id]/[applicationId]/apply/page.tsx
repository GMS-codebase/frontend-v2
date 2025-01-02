"use client";
import React, { useState } from "react";
import {
  SolarAddFolderBold,
  SolarClockSquareBold,
  SolarBookmarkBold,
  SolarCalendarBold,
  SolarSubtitlesBold,
} from "@/components/core/icons";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { authorizedApi } from "@/utils/api";
import { IoIosSave } from "react-icons/io";
import { useRouter } from "next/navigation";
import { getMyApplications, handleSubmit } from "@/services";
import Form from "@/components/forms/Form";
import MakeAppealModal from "@/components/Modals/appeal/MakeAppealModal";
import ViewAppealResultsModal from "@/components/Modals/appeal/ViewAppealResults";
import { ApplicationStage } from "@/types/application";
const Page = () => {
  const { id: callId } = useParams();
  const calls = useSelector((state: any) => state.calls);
  const call = calls?.calls?.filter((call: any) => call.uuid === callId)[0];
  const { myApplications } = useSelector((state: any) => state.applications);
  const [viewAppealResults, setViewAppealResults] = useState({
    opened: false,
    application: null,
  });
  const [openMakeAppeal, setOpenMakeAppeal] = useState({
    opened: false,
    stage: ApplicationStage.EVALUATION,
  });
  const forms = useSelector((state: any) => state.forms);
  const application = myApplications.find((app: any) => app?.uuid === callId);
  const form = forms.forms.find((form: any) => {
    const foundSubWindow = Object.keys(
      JSON.parse(application?.call.subwindowForms || "{}"),
    ).find((key: string) => key === application?.subWindow.uuid);

    return (
      form.uuid ===
      JSON.parse(application?.call.subwindowForms || "{}")[
        foundSubWindow as any
      ]
    );
  });

  console.log(application);
  const [
    isOpenEvaluationDetails,
    { open: openEvaluationDetails, close: closeEvaluationDetails },
  ] = useDisclosure(false);
  const [
    isOpenGrantCommitteeDetails,
    { open: openGrantCommitteeDetails, close: closeGrantCommitteeDetails },
  ] = useDisclosure(false);
  const [
    isOpenDueDiligencyDetails,
    { open: openDueDiligencyDetails, close: closeDueDiligencyDetails },
  ] = useDisclosure(false);

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
        <div
          className={`flex  ${application?.currentStage == "SUBMITTED" ? "w-full" : "w-[70%]"} gap-4 `}
        >
          {form && (
            <Form
              formData={{
                name: form?.name,
                qns: JSON.parse(form?.qns || "{}"),
              }}
              answers={JSON.parse(application.answers)}
              mode="viewing"
            />
          )}
        </div>
        {application?.currentStage === "SUBMITTED" ? (
          <div></div>
        ) : (
          <div className="flex flex-col bg-white min-w-[30%] h-fit rounded-2xl p-5 gap-4">
            <h2 className="font-bold">Decision</h2>

            {application?.call?.closedGrant ? (
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">Final Decision</h3>
                <div className="font-medium bg-[#4BC500] bg-opacity-10 text-[#4BC500] w-fit justify-start items-center rounded-full px-4 py-2">
                  {!application?.grantCommitteeDecision
                    ? "Pending"
                    : "APPROVED"}
                </div>

                {application?.grantCommitteeDecision && (
                  <div className="flex flex-col gap-2 mt-4">
                    <button
                      onClick={openGrantCommitteeDetails}
                      className="font-medium bg-[#005DE9] text-white w-full flex justify-center items-center gap-2 rounded-full px-4 py-2"
                    >
                      View details
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold">Evaluation Stage</h3>
                  <div
                    className={`font-medium  ${
                      !application?.call?.closedEvaluation ||
                      application?.stages?.find(
                        (stage: any) => stage.stage === "EVALUATION",
                      )?.status === "APPROVED"
                        ? "bg-[#4BC500] text-[#4BC500]"
                        : application?.stages?.find(
                              (stage: any) => stage.stage === "EVALUATION",
                            )?.status === "REJECTED"
                          ? "bg-red-600 text-red-600"
                          : ""
                    } bg-opacity-10  w-fit justify-start items-center rounded-full px-4 py-2`}
                  >
                    {application?.call?.closedEvaluation
                      ? application?.stages?.find(
                          (stage: any) => stage.stage === "EVALUATION",
                        )?.status
                      : "PENDING"}
                  </div>

                  {application?.call?.closedEvaluation && (
                    <div className="flex flex-col gap-2 mt-4">
                      {application?.evaluationDecisions?.length > 0 && (
                        <button
                          onClick={openEvaluationDetails}
                          className="font-medium bg-[#005DE9] text-white w-full flex justify-center items-center gap-2 rounded-full px-4 py-2"
                        >
                          View details
                        </button>
                      )}
                      {application?.stages.find(
                        (stage: any) => stage.stage === "EVALUATION",
                      )?.status === "REJECTED" &&
                        application?.call?.evaluationAppealOpened &&
                        !application?.hasAppealedEvaluation && (
                          <button
                            onClick={() =>
                              setOpenMakeAppeal({
                                opened: true,
                                stage: ApplicationStage.EVALUATION,
                              })
                            }
                            className="font-medium bg-[#005DE9] text-white w-full flex justify-center items-center gap-2 rounded-full px-4 py-2"
                          >
                            Appeal
                          </button>
                        )}

                      {application?.stages.find(
                        (stage: any) => stage.stage === "EVALUATION",
                      )?.status === "REJECTED" &&
                        application?.hasAppealedEvaluation && (
                          <button
                            onClick={() =>
                              setViewAppealResults({
                                opened: true,
                                application,
                              })
                            }
                            className="font-medium bg-[#005DE9] text-white w-full flex justify-center items-center gap-2 rounded-full px-4 py-2"
                          >
                            View Appeal
                          </button>
                        )}
                    </div>
                  )}
                </div>
                {application?.stages?.find(
                  (stage: any) => stage.stage === "DUE_DILIGENCY",
                )?.status != null && (
                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold">Due Diligence Stage</h3>
                    <div
                      className={`font-medium ${
                        !application?.call?.closedDueDiligency ||
                        application?.stages?.find(
                          (stage: any) => stage.stage === "DUE_DILIGENCY",
                        )?.status === "APPROVED"
                          ? "bg-[#4BC500] text-[#4BC500]"
                          : application?.stages?.find(
                                (stage: any) => stage.stage === "DUE_DILIGENCY",
                              )?.status === "REJECTED"
                            ? "bg-red-600 text-red-600"
                            : ""
                      } bg-opacity-10  w-fit justify-start items-center rounded-full px-4 py-2`}
                    >
                      {application?.call?.closedDueDiligency
                        ? application?.stages?.find(
                            (stage: any) => stage.stage === "DUE_DILIGENCY",
                          )?.status ||
                          application?.duediligencyDecisions[0]?.decision
                        : "PENDING"}
                    </div>

                    {application?.call?.closedDueDiligency &&
                      application?.duediligencyDecisions[0]?.decision && (
                        <div className="flex flex-col gap-2 mt-4">
                          <button
                            onClick={openDueDiligencyDetails}
                            className="font-medium bg-[#005DE9] text-white w-full flex justify-center items-center gap-2 rounded-full px-4 py-2"
                          >
                            View details
                          </button>
                        </div>
                      )}
                    {application?.stages.find(
                      (stage: any) => stage.stage === "DUE_DILIGENCY",
                    )?.status === "REJECTED" &&
                      application?.call?.dueAppealOpened &&
                      !application.hasAppealedDue && (
                        <button
                          onClick={() =>
                            setOpenMakeAppeal({
                              opened: true,
                              stage: ApplicationStage.DUE_DILIGENCY,
                            })
                          }
                          className="font-medium bg-[#005DE9] text-white w-full flex justify-center items-center gap-2 rounded-full px-4 py-2"
                        >
                          Appeal
                        </button>
                      )}
                    {application?.stages.find(
                      (stage: any) => stage.stage === "DUE_DILIGENCY",
                    )?.status === "REJECTED" &&
                      application.hasAppealedDue && (
                        <button
                          onClick={() =>
                            setViewAppealResults({
                              opened: true,
                              application,
                            })
                          }
                          className="font-medium bg-[#005DE9] text-white w-full flex justify-center items-center gap-2 rounded-full px-4 py-2"
                        >
                          View Appeal
                        </button>
                      )}
                  </div>
                )}
                {!application?.call?.closedGrant &&
                  application?.stages?.find(
                    (stage: any) => stage?.stage === "GRANT_COMMITTEE",
                  )?.status != null && (
                    <div className="flex flex-col gap-2">
                      <h3 className="font-semibold">Final Decision</h3>
                      <div className="font-medium bg-[#4BC500] bg-opacity-10 text-[#4BC500] w-fit justify-start items-center rounded-full px-4 py-2">
                        PENDING
                      </div>
                    </div>
                  )}
              </>
            )}
          </div>
        )}
      </div>
      <EvaluationDetails
        opened={isOpenEvaluationDetails}
        close={closeEvaluationDetails}
        evaluations={application?.evaluationDecisions || []}
        viewer="applicant"
        application={application}
      />
      <DueDiligencyDetails
        application={application}
        opened={isOpenDueDiligencyDetails}
        close={closeDueDiligencyDetails}
        viewer="applicant"
        decisions={application?.duediligencyDecisions}
      />
      <GrantCommitteeDetails
        application={application}
        close={closeGrantCommitteeDetails}
        opened={isOpenGrantCommitteeDetails}
        viewer="applicant"
      />
      <MakeAppealModal
        isOpen={openMakeAppeal.opened}
        onClose={() =>
          setOpenMakeAppeal({
            opened: false,
            stage: ApplicationStage.EVALUATION,
          })
        }
        application={application}
        stage={
          openMakeAppeal.stage as
            | ApplicationStage.EVALUATION
            | ApplicationStage.DUE_DILIGENCY
        }
      />
      <ViewAppealResultsModal
        isOpen={viewAppealResults.opened}
        onClose={() =>
          setViewAppealResults({ opened: false, application: null })
        }
        application={application}
      />
    </div>
  );
};

export default Page;