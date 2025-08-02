import { SolarEyeIcon } from "@/components/core/icons";
import { ApplicationStage } from "@/types/application";
import { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";

interface IProps {
  application: any;
  setSelectedStage: Dispatch<
    SetStateAction<"Evaluation" | "Due Diligence" | undefined>
  >;
  openMakeDecision: () => void;
  setGeneralCommentType: Dispatch<
    SetStateAction<"EVALUATION" | "DUE_DILIGENCY" | undefined>
  >;
  openEvaluationDetails: () => void;
  openGeneralCommentModal: () => void;
  stagesArr: any[];
  openMakeFirstDueDiligencyDecision: () => void;
  openDueDiligencyDetails: () => void;
}

const DecisionsBox = ({
  application,
  setGeneralCommentType,
  setSelectedStage,
  openEvaluationDetails,
  openMakeDecision,
  openGeneralCommentModal,
  stagesArr,
  openMakeFirstDueDiligencyDecision,
  openDueDiligencyDetails,
}: IProps) => {
  const profile = useSelector((state: any) => state.auth);
  console.log("applications --> ", application);
  return (
    <div className="flex flex-col bg-white w-[30%] h-fit rounded-2xl p-5 gap-4">
      <h2 className="font-bold">Decision</h2>
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
                : "bg-[#000F2306] text-black"
          } bg-opacity-10  w-fit justify-start items-center rounded-full px-4 py-2`}
        >
          {application?.call?.closedEvaluation
            ? application?.stages?.find(
                (stage: any) => stage.stage === "EVALUATION",
              )?.status
            : "PENDING"}
        </div>
        <div className="flex flex-col gap-2 mt-4">
          {application?.evaluationDecisions?.length < 3 &&
            !application?.evaluationDecisions?.find(
              (ev: any) =>
                ev.employee.user_id.toString() ===
                profile?.userProfile?.data.uuid.toString(),
            ) && (
              <div
                onClick={() => {
                  setSelectedStage("Evaluation");
                  openMakeDecision();
                }}
                className="flex gap-2 items-center justify-center bg-[#005DE9] text-white rounded-full px-2 py-2 w-full cursor-pointer"
              >
                <p>Make a decision</p>
              </div>
            )}

          {application?.evaluationDecisions?.length == 3 && (
            <div
              onClick={() => {
                setGeneralCommentType("EVALUATION");
                openGeneralCommentModal();
              }}
              className="flex items-center justify-center bg-[#005DE9] text-white rounded-full px-2 py-2 w-full cursor-pointer"
            >
              <p>
                {application?.evaluationFinalDecision
                  ? "View general comment"
                  : "Provide a general comment"}
              </p>
            </div>
          )}

          {application?.evaluationDecisions?.length > 0 && (
            <div className="flex flex-col gap-2">
              <button
                onClick={openEvaluationDetails}
                className="font-medium bg-[#005DE9] text-white w-full flex justify-center items-center gap-2 rounded-full px-4 py-2"
              >
                View Details
              </button>
            </div>
          )}
        </div>
      </div>
      {application?.currentStage !== ApplicationStage.EVALUATION &&
        stagesArr?.includes(ApplicationStage.DUE_DILIGENCY) && (
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
                    : "bg-[#000F2306] text-black"
              } bg-opacity-10  w-fit justify-start items-center rounded-full px-4 py-2`}
            >
              {application?.call?.closedDueDiligency
                ? application?.stages?.find(
                    (stage: any) => stage.stage === "DUE_DILIGENCY",
                  )?.status || application?.duediligencyDecisions[0]?.decision
                : "PENDING"}
            </div>
            <div className="flex flex-col gap-2 mt-4">
              {application?.duediligencyDecisions?.length < 3 &&
                !application?.duediligencyDecisions.find(
                  (dec: any) =>
                    dec?.employee?.user_id === profile?.userProfile?.data.uuid,
                ) && (
                  <div
                    onClick={() => {
                      setSelectedStage("Due Diligence");
                      if (
                        !application?.duediligencyForm &&
                        application?.duediligencyDecisions?.length < 2
                      ) {
                        openMakeFirstDueDiligencyDecision();
                      } else {
                        openMakeDecision();
                      }
                    }}
                    className="flex  items-center justify-center bg-[#005DE9] text-white rounded-full px-2 py-2 w-full cursor-pointer"
                  >
                    <p>Make a decision</p>
                  </div>
                )}
              {application?.duediligencyDecisions?.length == 3 && (
                <div
                  onClick={() => {
                    setGeneralCommentType("DUE_DILIGENCY");
                    openGeneralCommentModal();
                  }}
                  className="flex items-center justify-center bg-[#005DE9] text-white rounded-full px-2 py-2 w-full cursor-pointer"
                >
                  {application?.dueFinalDecision ? (
                    <p>View general comment</p>
                  ) : (
                    <p>Provide a general comment</p>
                  )}
                </div>
              )}
              {application?.duediligencyForm && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={openDueDiligencyDetails}
                    className="font-medium bg-[#005DE9] text-white w-full flex justify-center items-center gap-2 rounded-full px-4 py-2"
                  >
                    View Details
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default DecisionsBox;
