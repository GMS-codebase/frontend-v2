import React from "react";
import { Modal } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { FaClock, FaDownload } from "react-icons/fa";
import Image from "next/image";
import Books from "../../assets/Images/books.png";

const RevertDue = ({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) => {
  return (
    <Modal
      size={"lg"}
      opened={opened}
      onClose={close}
      withCloseButton={false}
      centered
    >
      {/* Close Icon */}
      <div className=" flex flex-col gap-2 align-middle rounded-2xl bg-white p-6  relative  h-2/5 w-fit  ">
        <div className=" flex flex-col gap-2 text-center font-bold mb-4 justify-center items-center">
          <Image src={Books} alt="email" width={200} height={200} />
        </div>
        <div className="absolute top-3 right-3">
          <button
            onClick={close}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-gray-400 text-center ">
            <p>
              Are you sure you want to Nullify Decision made on DueDiligence ?
            </p>
          </div>

          <div className="flex gap-4 mt-4 justify-center items-center">
            <div className="bg-[#000F23] cursor-pointer text-white flex  justify-center items-center px-12 py-2 rounded-full font-bold w-full text-xl">
              Cancel
            </div>
            <div className="bg-[#000F23] cursor-pointer text-white flex  justify-center items-center px-12 py-2 rounded-full font-bold w-full text-xl">
              Confirm
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RevertDue;
