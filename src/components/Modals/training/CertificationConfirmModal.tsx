"use client";
import { Modal } from "@mantine/core";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import SideVector1 from "@/assets/Vectors/redSideVector.svg";
import SideVector2 from "@/assets/Vectors/redSideVector2.svg";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action:
    | "TRAINING_REQUEST"
    | "TRAINING_DECISION"
    | "CERTIFICATION_REQUEST"
    | "CERTIFICATION_DECISION"
    | "ADD"
    | "EDIT"
    | "REMOVE"
    | null;
  traineeNames?: string[];
}

const CertificationConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  traineeNames,
}: ConfirmModalProps) => {
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
      default:
        return "Are you sure you want to proceed with this action?";
    }
  };

  return (
    <Modal
      size=""
      opened={isOpen}
      onClose={onClose}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="lg:w-[550px] lg:h-[300px] w-full h-full relative bg-white rounded-3xl p-4 pt-10 pb-4 flex flex-col items-center">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={onClose}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <Image
          src={SideVector1}
          alt="vector"
          className="absolute bottom-[3rem] right-[-2rem] h-32"
          width={100}
          height={50}
        />
        <Image
          src={SideVector2}
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
          <div className="w-full flex justify-center mt-4 space-x-4 p-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-300 text-black rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              type="button"
              className="w-full px-4 py-3 bg-[#C50D0DF2] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CertificationConfirmModal;
