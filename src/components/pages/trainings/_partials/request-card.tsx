import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { Accordion, Button } from "@mantine/core";
import ConfirmationModal from "@/components/Modals/training/CertificationConfirmModal";
import { makeTraineeActionRequestDecision } from "@/services";
import { IRequest } from "@/types/trainings";

// --- Helpers ---
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
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
          Rejected
        </span>
      );
    case "APPROVED":
      return (
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          Approved
        </span>
      );
    case "PENDING":
      return (
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
          Pending
        </span>
      );
    default:
      return null;
  }
};

// --- Component ---
const RequestCard: FC<{ request: IRequest; currentRole: string }> = ({
  request,
  currentRole,
}) => {
  const dispatch = useDispatch();
  const { decisionLoading } = useSelector((state: any) => state.trainings);

  const [modalOpen, setModalOpen] = useState(false);
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
    dispatch(
      makeTraineeActionRequestDecision(request.uuid, decision, message) as any
    );
  };

  useEffect(() => {
    if (!decisionLoading && modalOpen) {
      setModalOpen(false);
    }
  }, [decisionLoading]);

  const baseContent = (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 w-full">
      <div className="flex items-start gap-3 flex-1">
        {renderStatusBadge(request.status)}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 capitalize mb-1 break-words">
            {request.requestType.replace("_", " ").toLowerCase()}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed break-words">
            {request.reason}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 text-sm text-gray-500">
        <span>{format(new Date(request.doneAt), "dd MMM yyyy")}</span>
        {request.status === "PENDING" && currentRole === "SDF_SECRETARIATE" && (
          <div className="flex items-center gap-2">
            <Button
              color="red"
              size="xs"
              onClick={() => handleOpenModal("REJECT")}
            >
              Reject
            </Button>
            <Button
              color="blue"
              size="xs"
              onClick={() => handleOpenModal("APPROVE")}
            >
              Approve
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full border rounded-lg shadow-sm bg-white">
      {request.status === "PENDING" ? (
        <div className="p-4">{baseContent}</div>
      ) : (
        <Accordion variant="separated">
          <Accordion.Item value="response">
            <Accordion.Control>
              <div className="p-2 w-full">{baseContent}</div>
            </Accordion.Control>
            <Accordion.Panel>
              <div className="border-t bg-gray-50 p-4 space-y-2 rounded-b-lg">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Responded by:
                  </p>
                  <p className="text-sm text-gray-600">
                    {request.response?.user.firstname}{" "}
                    {request.response?.user.lastname}
                    {" - "}
                    {request.response?.user.role} @{" "}
                    {request.response?.user.institution}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Message:</p>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {request.response?.message || "No message provided."}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  Responded on{" "}
                  {format(
                    new Date(request.response?.doneAt),
                    "dd MMM yyyy HH:mm"
                  )}
                </p>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      )}

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        action={modalAction}
        decisionLoading={decisionLoading}
        traineeNumber={request.newTraineesRequested}
        traineesIds={request.traineeIds}
      />
    </div>
  );
};

export default RequestCard;
