import { Modal } from "@mantine/core";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import SideVector1 from "@/assets/Vectors/sidevecto.svg";
import SideVector2 from "@/assets/Vectors/sidevector2.svg";
import RedVector1 from "@/assets/Vectors/redSideVector.svg";
import RedVector2 from "@/assets/Vectors/redSideVector2.svg";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { getUploadedMinutes } from "@/utils/funcs";
import { useDispatch } from "react-redux";

interface DeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  minute: any;
  decision: string;
}

const MinutesDecisionConfirm = ({
  isOpen,
  onClose,
  minute,
  decision,
}: DeleteConfirmProps) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState({
    value: "",
    isError: "",
  });
  const [loading, setLoading] = useState(false);
  const handleMakeMinuteDecision = () => {
    if (!comment.value) {
      return setComment({ ...comment, isError: "Please enter a comment!" });
    }
    setLoading(true);
    authorizedApi
      .post(`/negotiation-contract/applicant/decision`, {
        applicationID: minute.application.uuid,
        applicantID: minute.application.applicant.user_id,
        decision:
          decision.toLowerCase() === "approve"
            ? "APPROVED"
            : decision.toLowerCase() === "reject"
              ? "REJECTED"
              : "NEGOTIATE",
        comment: comment,
      })
      .then(() => {
        notifications.show({
          message: "Decision saved successfully!",
        });
        setComment({ value: "", isError: "" });
        onClose();
        getUploadedMinutes(dispatch, "applicant");
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      size=""
      opened={isOpen}
      onClose={onClose}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[550px] h-fit relative bg-white rounded-3xl p-4 pt-10 flex flex-col items-center">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={onClose}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <Image
          src={decision.toLowerCase() !== "reject" ? SideVector1 : RedVector1}
          alt="vector"
          className="absolute bottom-[3rem] right-[-2rem] h-32"
          width={100}
          height={50}
        />
        <Image
          src={decision.toLowerCase() !== "reject" ? SideVector2 : RedVector2}
          alt="vector"
          className="absolute top-[3rem] left-[-2rem] h-32"
          width={100}
          height={50}
        />
        <div className="w-4/5 flex flex-col items-center mt-4 overflow-hidden pb-8">
          <h1 className="text-2xl font-extrabold text-center">
            {decision} Minutes
          </h1>
          <h2 className="text-[#000F2369] text-lg font-medium text-center mt-2">
            Add a comment and confirm to proceed
          </h2>
          <div className="mt-6 w-full">
            <h1 className="block text-xs font-bold text-gray-700">Comment</h1>
            <textarea
              value={comment.value}
              onChange={(e: any) =>
                setComment({ ...comment, value: e.target.value })
              }
              className="mt-1 block w-full resize-none p-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {comment.isError && (
              <p className="text-red-400 text-base mt-1">{comment.isError}</p>
            )}
          </div>
          <div className="w-full flex justify-center mt-1 space-x-4 p-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-300 text-black rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={handleMakeMinuteDecision}
              type="button"
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2"
            >
              {loading ? "Loading . . ." : decision}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MinutesDecisionConfirm;
