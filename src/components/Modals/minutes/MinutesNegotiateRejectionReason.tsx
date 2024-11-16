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
import { getContracts, getRejectedMinutes, getUploadedMinutes, getMinutes } from "@/utils/funcs";
import { useDispatch } from "react-redux";
interface DeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  minute: any;
  type: string;
}

const MinutesRejectionReason = ({
  isOpen,
  onClose,
  minute,
  type,
}: DeleteConfirmProps) => {
  const dispatch = useDispatch();
  console.log(minute);
  const [loading, setLoading] = useState(false);
  const action = type === "rejected" ? "revert" : "reject";
  const handleMinutesRevert = () => {
    setLoading(true);
    authorizedApi
      .patch(
        `/negotiation-contract/applications/sdf/${type === "rejected" ? "revert" : "reject"}/${minute?.uuid}`,
      )
      .then(() => {
        notifications.show({
          message: `Application ${action}ed successfully!`,
          color: "green",
        });
        onClose();
        getUploadedMinutes(dispatch, "applicant");
        getRejectedMinutes(dispatch, "applicant");
        getContracts(dispatch);
        getMinutes(dispatch);
      })
      .catch((error) => {
        console.error(error);
        notifications.show({
          message: `Failed to ${action} the application!`,
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
          <h1 className="text-2xl font-extrabold text-center">
            {type === "rejected" ? "Rejected Minutes" : "Negotiated Minutes"}
          </h1>
          <div className="mt-6 w-full">
            <h1 className="block text-xs font-bold text-gray-700">
              Reason For {type === "rejected" ? "Rejection" : "Negotiation"}
            </h1>
            <textarea
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
              onClick={handleMinutesRevert}
              type="button"
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2"
            >
              {loading ? "Loading . . ." : action}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MinutesRejectionReason;
