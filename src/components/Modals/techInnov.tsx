import React, { useState } from "react";
import { Modal } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { FaClock, FaDownload } from "react-icons/fa";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { unauthorizedApi } from "@/utils/api";

const CallModal = ({
  opened,
  close,
  call,
  openLogin,
}: {
  opened: boolean;
  close: () => void;
  call: any;
  openLogin: () => void;
}) => {
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);
  const handleDownloadInstructions = async () => {
    setLoading(true);
    try {
      console.log("attachment --> ", call.attachment);
      const filename = call.attachment.split("/").pop();
      console.log(filename);
      const response = await unauthorizedApi.get(
        `/admin/download/calls/${filename}`,
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
      link.download = call.attachment || "downloaded-file.jpg";
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
      size={"xl"}
      opened={opened}
      onClose={close}
      withCloseButton={false}
      centered
    >
      {/* Close Icon */}
      <div className=" flex flex-col gap-2 align-middle rounded-2xl bg-white p-6  relative  h-2/5 w-full   ">
        <div className="absolute top-3 right-3">
          <button
            onClick={close}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-xl text-start">{call?.title}</h2>
          <div className="text-gray-400 text-start">
            <p>{call?.description}</p>
          </div>
          <div className="flex gap-4 mt-4 justify-around items-stretch">
            <div className="flex items-center gap-2  bg-[#E97E00] bg-opacity-10 px-4 py-2 rounded-full font-bold">
              <FaClock className="text-[#E97E00]" />
              <p className="text-[#E97E00]">
                {call?.startDate && format(call?.startDate, "dd MMMM yyyy")} -{" "}
                {call?.endDate && format(call?.endDate, "dd MMMM yyyy")}
              </p>
            </div>
            <div
              onClick={handleDownloadInstructions}
              className="flex items-center gap-2 text-primary bg-[#005DE908] bg-opacity-10 cursor-pointer px-4 py-2 rounded-full font-bold "
            >
              <FaDownload className="text-primary" />
              <div>
                {loading
                  ? "Downloading . . ."
                  : "View application instructions"}
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-4 justify-around ">
            <button
              onClick={close}
              className="bg-black cursor-pointer text-white px-36 py-2 rounded-full font-bold"
            >
              {" "}
              Back
            </button>
            <button
              onClick={() => {
                close();
                openLogin();
              }}
              className="bg-primary cursor-pointer text-white px-36 py-2 rounded-full font-bold"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CallModal;
