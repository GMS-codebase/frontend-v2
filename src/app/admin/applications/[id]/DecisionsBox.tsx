import { SolarEyeIcon } from "@/components/core/icons";
import { ApplicationStage } from "@/types/application";
import { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";

interface IProps {
  application: any;
  openEvaluationDetails: () => void;
  stagesArr: any[];
  openDueDiligencyDetails: () => void;
  openGrantCommitteeDetails: () => void;
}

const DecisionsBox = ({
  application,
  openEvaluationDetails,
  stagesArr,
  openDueDiligencyDetails,
  openGrantCommitteeDetails,
}: IProps) => {
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

      {application?.currentStage !== ApplicationStage.EVALUATION &&
        stagesArr?.includes(ApplicationStage.DUE_DILIGENCY) && (
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Grant Committee</h3>
            <div className="font-medium bg-[#4BC500] bg-opacity-10 text-[#4BC500] w-fit justify-start items-center rounded-full px-4 py-2">
              {!application?.grantCommitteeDecision ? "Pending" : "APPROVED"}
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
        )}
    </div>
  );
};

export default DecisionsBox;
