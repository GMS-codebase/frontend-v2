import ConfirmationModal from "@/components/Modals/training/CertificationConfirmModal";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { makeTraineeActionRequestDecision } from "@/services";
import { IRequest } from "@/types/trainings";
import { format } from "date-fns";
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

type props = {
  request: IRequest;
  currentRole:string
};

const getActionType = (
  requestType: IRequest["requestType"],
  action: "APPROVE" | "REJECT"
) => {
  switch (requestType) {
    case "ADD_TRAINEES":
      return action === "APPROVE" ? "ADD_APPROVE" : "ADD_REJECT";
    case "EDIT_TRAINEES":
      return action === "APPROVE" ? "EDIT_APPROVE" : "EDIT_REJECT";
    case "REMOVE_TRAINEES":
      return action === "APPROVE" ? "REMOVE_APPROVE" : "REMOVE_REJECT";
    default:
      return null;
  }
};

const renderStatusBadge = (status: string) => {
  switch (status) {
    case "REJECTED":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 px-3 py-1 rounded-full font-medium">
          REJECTED
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1 rounded-full font-medium">
          APPROVED
        </Badge>
      );
    case "PENDING":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 px-3 py-1 rounded-full font-medium">
          PENDING
        </Badge>
      );
    default:
      return null;
  }
};

const RequestCard: FC<props> = ({ request,currentRole }) => {
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);

  const { decisionLoading, error } = useSelector(
    (state: any) => state.trainings
  );

  const [modalAction, setModalAction] = useState<
    | "ADD_APPROVE"
    | "EDIT_APPROVE"
    | "REMOVE_APPROVE"
    | "ADD_REJECT"
    | "EDIT_REJECT"
    | "REMOVE_REJECT"
    | null
  >(null);

  const handleOpenModal = (actionType: "APPROVE" | "REJECT") => {
    const action = getActionType(request.requestType, actionType);
    setModalAction(action);
    setModalOpen(true);
  };

  const handleConfirm = (message?: string) => {
    if (!modalAction || !message) return;
    const decision = modalAction.includes("APPROVE") ? "APPROVE" : "REJECT";
    dispatch(makeTraineeActionRequestDecision(request.uuid, decision, message) as any);
  };

  useEffect(() => {
    if (!decisionLoading && modalOpen) {
      setModalOpen(false);
    }
  }, [decisionLoading]);

  return (
    <div className="w-full">
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-2 py-2 rounded-lg">
        <div className="flex items-start md:items-center gap-4 flex-1 w-full">
          {renderStatusBadge(request.status)}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 mb-1 break-words">
              {request.requestType.toLowerCase()}
            </div>
            <div className="text-gray-600 text-sm leading-relaxed break-words">
              {request.reason}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="text-gray-500 text-sm md:ml-4 whitespace-nowrap">
            {format(new Date(request.doneAt), "dd MMM yyyy")}
          </div>
          {request.status === "PENDING" && currentRole === "SDF_SECRETARIATE" && (
            <div className="flex items-center gap-5">
              <Button
                onClick={() => handleOpenModal("REJECT")}
                className="bg-danger hover:bg-danger/80 text-white"
              >
                Reject
              </Button>
              <Button
                onClick={() => handleOpenModal("APPROVE")}
                className="bg-primary hover:bg-primary/80 text-white"
              >
                Approve
              </Button>
            </div>
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        action={modalAction}
        decisionLoading={decisionLoading}
        traineeNumber={request.newTraineesRequested}
      />
    </div>
  );
};

export default RequestCard;
