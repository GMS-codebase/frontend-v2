import { Modal } from "@mantine/core";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import SideVector1 from "@/assets/Vectors/sidevecto.svg";
import SideVector2 from "@/assets/Vectors/sidevector2.svg";
import RedVector1 from "@/assets/Vectors/redSideVector.svg";
import RedVector2 from "@/assets/Vectors/redSideVector2.svg";
import { authorizedApi, unauthorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import {
  getContracts,
  getRejectedMinutes,
  getUploadedMinutes,
  getMinutes,
} from "@/services";
import { useDispatch } from "react-redux";
import { SolarDownloadMinimalisticBold } from "@/components/core/icons";
interface DeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  minute: any;
  type: string;
  decision: any;
}

const ViewMinutes = ({
  isOpen,
  onClose,
  minute,
  type,
  decision,
}: DeleteConfirmProps) => {
  console.log(" --. ", minute, decision);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const comment =
    type === "reject"
      ? JSON.parse(decision?.comment ?? "{}")?.value
      : decision?.comment;
  const handleDownloadInstructions = async () => {
    setLoading(true);
    try {
      const filename = minute.minutesAttachment.split("/").pop();

      const response = await unauthorizedApi.get(
        `/admin/download/contract-negotiations/${filename}`,
        {
          responseType: "blob",
        },
      );
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = minute.minutesAttachment || "downloaded-file.jpg";
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setLoading(false);
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
              disabled
              value={comment}
              className="mt-1 block w-full resize-none p-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />

            <div
              onClick={handleDownloadInstructions}
              className="flex gap-2 text-[#005DE9] bg-[#005DE9] bg-opacity-10 px-4 py-2 rounded-full  w-fit font-bold items-center justify-center"
            >
              <span>
                <SolarDownloadMinimalisticBold />
              </span>
              <p>
                {loading ? "Downloading . . ." : "Download Minutes Attachment"}
              </p>
            </div>
          </div>
          <div className="w-full flex justify-center mt-1 space-x-4 p-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-300 text-black rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewMinutes;
