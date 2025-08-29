"use client";
import { Modal } from "@mantine/core";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import SideVector1 from "@/assets/Vectors/redSideVector.svg";
import SideVector2 from "@/assets/Vectors/redSideVector2.svg";
import SideVector3 from "@/assets/Vectors/sidevecto.svg";
import SideVector4 from "@/assets/Vectors/sidevector2.svg";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (message?: string) => void;
  action:
    | "TRAINING_REQUEST"
    | "TRAINING_DECISION"
    | "CERTIFICATION_REQUEST"
    | "CERTIFICATION_DECISION"
    | "ADD"
    | "EDIT"
    | "REMOVE"
    | "ADD_APPROVE"
    | "EDIT_APPROVE"
    | "REMOVE_APPROVE"
    | "ADD_REJECT"
    | "EDIT_REJECT"
    | "REMOVE_REJECT"
    | null;
  traineeNames?: string[];
  traineeNumber?: number;
  decisionLoading?: boolean;
  traineesIds?: string[];
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  traineeNames,
  traineeNumber,
  decisionLoading,
  traineesIds,
}: ConfirmModalProps) => {
  const [message, setMessage] = useState("");

  const getTitle = () => {
    switch (action) {
      case "TRAINING_REQUEST":
        return "Confirm Training Request";
      case "TRAINING_DECISION":
        return "Confirm Training Decision";
      case "CERTIFICATION_REQUEST":
        return "Confirm Certification Request";
      case "CERTIFICATION_DECISION":
        return "Confirm Certification Decision";
      case "ADD":
        return "Confirm Adding Trainees";
      case "EDIT":
        return "Confirm Editing Trainees";
      case "REMOVE":
        return "Confirm Removing Trainees";
      case "ADD_APPROVE":
        return "Approve Adding Trainees";
      case "EDIT_APPROVE":
        return "Approve Editing Trainees";
      case "REMOVE_APPROVE":
        return "Approve Removing Trainees";
      case "ADD_REJECT":
        return "Reject Adding Trainees";
      case "EDIT_REJECT":
        return "Reject Editing Trainees";
      case "REMOVE_REJECT":
        return "Reject Removing Trainees";
      default:
        return "Confirm Action";
    }
  };

  const getMessage = () => {
    switch (action) {
      case "TRAINING_REQUEST":
        return "Are you sure you want to request a review for this training?";
      case "TRAINING_DECISION":
        return "Are you sure you want to make a decision for this training?";
      case "CERTIFICATION_REQUEST":
        return traineeNames && traineeNames.length > 0
          ? `Are you sure you want to request certification for the following trainees: ${traineeNames.join(", ")}?`
          : "Are you sure you want to request certification?";
      case "CERTIFICATION_DECISION":
        return traineeNames && traineeNames.length > 0
          ? `Are you sure you want to make a certification decision for the following trainees: ${traineeNames.join(", ")}?`
          : "Are you sure you want to make a certification decision?";
      case "ADD":
        return "Are you sure you want to request adding trainees to this training?";
      case "EDIT":
        return traineeNames && traineeNames.length > 0
          ? `Are you sure you want to request editing the following trainees: ${traineeNames.join(", ")}?`
          : "Are you sure you want to request editing trainees?";
      case "REMOVE":
        return traineeNames && traineeNames.length > 0
          ? `Are you sure you want to request removing the following trainees: ${traineeNames.join(", ")}?`
          : "Are you sure you want to request removing trainees?";
      case "ADD_APPROVE":
        return `Are you sure you want to approve adding ${traineeNumber} trainee(s)?`;
      case "EDIT_APPROVE":
        return `Are you sure you want to approve editing these trainee(s)?`;
      case "REMOVE_APPROVE":
        return "Are you sure you want to approve removing these trainees?";
      case "ADD_REJECT":
        return `Are you sure you want to reject adding these ${traineeNumber} trainee(s)?`;
      case "EDIT_REJECT":
        return "Are you sure you want to reject editing these trainees?";
      case "REMOVE_REJECT":
        return "Are you sure you want to reject removing these trainees?";
      default:
        return "Are you sure you want to proceed with this action?";
    }
  };

  const isBadAction =
    action === "REMOVE" ||
    action === "REMOVE_REJECT" ||
    action === "REMOVE_APPROVE" ||
    action === "ADD_REJECT" ||
    action === "EDIT_REJECT";

  const isDecisionAction =
    action === "REMOVE_REJECT" ||
    action === "REMOVE_APPROVE" ||
    action === "ADD_REJECT" ||
    action === "EDIT_REJECT" ||
    action === "ADD_APPROVE" ||
    action === "EDIT_APPROVE";

  const handleConfirm = () => {
    onConfirm(message);
    setMessage("");
  };

  const { currentTraining } = useSelector((state: any) => state.trainings);

  const getSelectedTrainees = () => {
    if (traineesIds?.length && currentTraining?.trainees) {
      return currentTraining.trainees.filter((t: any) =>
        traineesIds.includes(t?.uuid)
      );
    }
    return [];
  };

  return (
    <Modal
      size=""
      opened={isOpen}
      onClose={onClose}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="lg:w-[550px] w-full h-full relative bg-white rounded-3xl p-4 pt-10 pb-4 flex flex-col items-center">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={onClose}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <Image
          src={isBadAction ? SideVector1 : SideVector3}
          alt="vector"
          className="absolute bottom-[3rem] right-[-2rem] h-32"
          width={100}
          height={50}
        />
        <Image
          src={isBadAction ? SideVector2 : SideVector4}
          alt="vector"
          className="absolute top-[3rem] left-[-2rem] h-32"
          width={100}
          height={50}
        />
        <div className="w-4/5 flex flex-col items-center mt-4 overflow-hidden">
          <h1 className="text-2xl font-extrabold text-center">{getTitle()}</h1>
          <h2 className="text-[#000F2369] text-lg font-medium text-center mt-2">
            {getMessage()}
          </h2>
          <div className="w-full px-3">
            {getSelectedTrainees().length > 0 && (
              <div className="w-full mt-4 max-h-48 overflow-y-auto border rounded-lg p-3 bg-gray-50 ">
                <h3 className="font-semibold mb-2">
                  Selected Trainees ({getSelectedTrainees().length})
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ">
                  {getSelectedTrainees().map((trainee: any) => (
                    <li key={trainee.uui}>
                      {trainee?.firstName + " " + trainee?.lastName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {isDecisionAction && (
            <div className="space-y-1 w-full mt-2 px-3">
              <label htmlFor="">message (optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter a message..."
                className="w-full mt-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
            </div>
          )}
          <div className="w-full flex justify-center mt-4 space-x-4 p-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-300 text-black rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={decisionLoading}
              type="button"
              className={`${isBadAction ? "bg-danger hover:bg-danger/80" : "bg-primary hover:bg-primary/80"} w-full flex items-center justify-center px-4 py-3 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2`}
            >
              {decisionLoading && <Loader2 className="animate-spin mr-2" />}
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
