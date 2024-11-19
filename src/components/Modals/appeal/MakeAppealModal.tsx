import { Modal } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { FaGavel } from "react-icons/fa";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface AppealModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: any;
  stage: "EVALUATION" | "DUE_DILIGENCY";
}

const MakeAppealModal = ({ isOpen, onClose, application, stage }: AppealModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [appealReason, setAppealReason] = useState("");

  const handleAppealSubmit = () => {
    if (!appealReason.trim()) {
      notifications.show({
        message: "Please provide a reason for your appeal",
        color: "red",
      });
      return;
    }

    setLoading(true);
    authorizedApi
      .post(`/appeals/${application?.uuid}/create`, {
        appeal: appealReason,
        stageId: stage
      })
      .then(() => {
        notifications.show({
          message: "Appeal submitted successfully!",
          color: "green",
        });
        onClose();
      })
      .catch((error) => {
        notifications.show({
          title: "Failed to submit appeal!",
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
        <div className="w-4/5 flex flex-col items-center mt-4 overflow-hidden pb-8">
          <FaGavel size={40} className="text-blue-500 mb-4" />
          <h1 className="text-2xl font-extrabold text-center">
            Submit an Appeal
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Please provide detailed reasons for your appeal. This will help us better understand your case.
          </p>
          <div className="mt-6 w-full">
            <h1 className="block text-xs font-bold text-gray-700">
              Appeal Reason
            </h1>
            <textarea
              value={appealReason}
              onChange={(e) => setAppealReason(e.target.value)}
              placeholder="Explain why you would like to appeal this decision..."
              rows={5}
              className="mt-1 block w-full resize-none p-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
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
              onClick={handleAppealSubmit}
              type="button"
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2"
            >
              {loading ? "Submitting..." : "Submit Appeal"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MakeAppealModal;