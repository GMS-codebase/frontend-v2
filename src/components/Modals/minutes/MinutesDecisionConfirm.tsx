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
import {
  getApprovedMinutes,
  getMyApplications,
  getNegotiatedMinutes,
  getRejectedMinutes,
  getUploadedMinutes,
} from "@/services";
import { useDispatch } from "react-redux";
import { ClipLoader } from "react-spinners";

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
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [comment, setComment] = useState({
    value: "",
    isError: "",
  });
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const handleInitialSubmit = () => {
    if (!comment.value) {
      return setComment({ ...comment, isError: "Please enter a comment!" });
    }
    setConfirmModalOpen(true);
  };

  const handleConfirmedSubmit = () => {
    setLoading(true);
    setConfirming(true);
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
        comment: comment.value,
      })
      .then(() => {
        notifications.show({
          message: "Decision saved successfully!",
        });
        setComment({ value: "", isError: "" });
        onClose();
        getUploadedMinutes(dispatch, "applicant");
        getMyApplications(dispatch);
        getApprovedMinutes(dispatch, "applicant");
        getRejectedMinutes(dispatch, "applicant");
        getNegotiatedMinutes(dispatch, "applicant");
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
        setConfirming(false);
        setConfirmModalOpen(false);
      });
  };

  return (
    <>
      {/* Main Modal */}
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
                onClick={handleInitialSubmit}
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

      {/* Confirmation Modal */}
      <Modal
        opened={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        size={""}
        withCloseButton={false}
        closeOnClickOutside={false}
      >
        <div className="w-[550px] h-fit relative rounded-3xl bg-white p-4 pt-10 flex flex-col items-center">
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-center">
            Confirm {decision}
          </h1>
          <p className="text-center mb-4">
            Are you sure you want to {decision.toLowerCase()} these minutes?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setConfirmModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-black rounded-full"
            >
              Cancel
            </button>
            <button
              disabled={confirming}
              onClick={handleConfirmedSubmit}
              className={`px-4 py-2 text-white rounded-full ${
                decision.toLowerCase() === "reject"
                  ? "bg-red-500"
                  : "bg-blue-500"
              }`}
            >
              {confirming ? (
                <span>
                  <ClipLoader color="white" size={20} /> Submitting . . .
                </span>
              ) : (
                "Yes, proceed"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MinutesDecisionConfirm;
