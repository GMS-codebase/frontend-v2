import { Modal } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { FaGavel } from "react-icons/fa";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { getAppeals } from "@/utils/funcs";
import { useDispatch } from "react-redux";

interface ViewAppealModalProps {
  isOpen: boolean;
  onClose: () => void;
  appeal: any;
}

const ViewAppealModal = ({ isOpen, onClose, appeal }: ViewAppealModalProps) => {
  console.log("appeal ", appeal);
  const [loading, setLoading] = useState(false);
  const [decisionComment, setDecisionComment] = useState("");
  useEffect(() => {
    setDecisionComment(appeal?.appeal_answer ?? "");
  }, [appeal]);
  const [required, setRequired] = useState(false);
  const dispatch = useDispatch();
  const handleAppealDecision = (isApproved: boolean) => {
    if (decisionComment?.length === 0) {
      setRequired(true);
      return;
    }
    setLoading(true);
    authorizedApi
      .put(`/appeals/${appeal.uuid}/${isApproved ? "approve" : "reject"}`, {
        comment: decisionComment,
        decision: isApproved ? "APPROVE" : "REJECT",
      })
      .then(() => {
        notifications.show({
          message: `Appeal ${isApproved ? "approved" : "rejected"} successfully!`,
          color: "green",
        });
        onClose();
        getAppeals(dispatch, "admin");
      })
      .catch((error) => {
        notifications.show({
          title: "Failed to process appeal decision!",
          message: error.response.data.message,
          color: "red",
        });
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
        <div className="w-full px-5 flex flex-col items-center mt-4 overflow-hidden pb-8">
          <FaGavel size={40} className="text-blue-500 mb-4" />
          <h1 className="text-2xl font-extrabold text-center">Review Appeal</h1>
          <p className="text-gray-600 text-center mt-2">
            Please review the appeal details and make a decision.
          </p>
          <div className="mt-6 w-full">
            <h1 className="w-full text-start block text-xs font-bold text-gray-700">
              Appeal Reason
            </h1>
            <textarea
              value={appeal?.appeal_comment}
              readOnly
              disabled
              className="mt-1 block w-full text-sm p-3 bg-[#000F230A] rounded-2xl min-h-[80px] resize-none"
            />
          </div>
          <h1 className="w-full mt-3 text-start block text-xs font-bold text-gray-700">
            Your Decision Comment
          </h1>
          {required && (
            <p className="text-xs text-red-500">This field is required</p>
          )}
          <textarea
            placeholder="Enter your decision comment here..."
            className="mt-1 block w-full text-sm p-3 bg-[#000F230A] rounded-2xl min-h-[60px] resize-none"
            value={decisionComment}
            onChange={(e) => setDecisionComment(e.target.value)}
            required
          />
        </div>
        <div className="w-full flex justify-center mt-1 space-x-4 p-6">
          <button
            type="button"
            onClick={() => handleAppealDecision(false)}
            disabled={loading || appeal?.status === "REJECTED"}
            className={`w-full px-4 py-3 ${appeal?.status === "REJECTED" ? "bg-red-400 cursor-not-allowed" : "bg-red-500"} text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
          >
            {loading ? "Processing..." : "Reject Appeal"}
          </button>
          <button
            onClick={() => handleAppealDecision(true)}
            type="button"
            disabled={loading || appeal?.status === "APPROVED"}
            className={`w-full px-4 py-3 ${appeal?.status === "APPROVED" ? "bg-green-400 cursor-not-allowed" : "bg-green-500"} text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
          >
            {loading ? "Processing..." : "Accept Appeal"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewAppealModal;
