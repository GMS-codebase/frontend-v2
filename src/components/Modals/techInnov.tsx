import React from "react";
import { Modal } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { FaClock, FaDownload } from "react-icons/fa";

const CallModal = ({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) => {
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
            <IconX size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-xl text-start">Tech Innovators</h2>
          <div className="text-gray-400 text-start">
            <p>
              Lorem ipsum dolor sit amet consectetur. Cursus odio imperdiet nibh
              ornare ac molestie. Dignissim sapien molestie adipiscing augue
              vitae. Scelerisque morbi volutpat tellus ipsum et suspendisse
              velit mattis. Eu aliquam arcu quisque sit. Lorem ipsum dolor sit
              amet consectetur. Cursus odio imperdiet nibh ornare ac molestie.
              Dignissim sapien molestie adipiscing augue vitae. Scelerisque
              morbi volutpat tellus ipsum et suspendisse velit mattis. Eu
              aliquam arcu quisque sit. Lorem ipsum dolor sit amet consectetur.
              Cursus odio imperdiet nibh ornare ac molestie. Dignissim sapien
              molestie adipiscing augue vitae. Scelerisque morbi volutpat tellus
              ipsum et suspendisse velit mattis. Eu aliquam arcu quisque sit.
              ipsum et suspendisse velit mattis. Eu aliquam arcu quisque sit.
            </p>
          </div>
          <div className="flex gap-4 mt-4 justify-around items-stretch">
            <div className="flex items-center gap-2  bg-[#E97E00] bg-opacity-10 px-4 py-2 rounded-full font-bold">
              <FaClock className="text-[#E97E00]" />
              <p className="text-[#E97E00]">12th July 2024 - 31st July 2024</p>
            </div>
            <div className="flex items-center gap-2 text-primary bg-primary bg-opacity-10 cursor-pointer px-4 py-2 rounded-full font-bold ">
              <FaDownload className="text-primary" />
              <div>View application instructions</div>
            </div>
          </div>
          <div className="flex gap-4 mt-4 justify-around ">
            <div className="bg-black cursor-pointer text-white px-36 py-2 rounded-full font-bold">
              {" "}
              Back
            </div>
            <div className="bg-primary cursor-pointer text-white px-36 py-2 rounded-full font-bold">
              Apply
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CallModal;
