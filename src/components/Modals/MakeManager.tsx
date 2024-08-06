import { Checkbox, Modal, Select, Stepper } from "@mantine/core";
import Image from "next/image";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import SideVector1 from "@/assets/Vectors/sidevecto.svg";
import SideVector2 from "@/assets/Vectors/sidevector2.svg";
import managerSvg from "@/assets/Vectors/make_manager.svg";
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  position: string;
  isInternal: undefined | boolean;
};
const MakeManager = ({
  isOpenMakeManager,
  closeMakeManager,
  level,
}: {
  isOpenMakeManager: boolean;
  closeMakeManager: () => void;
  level: string;
}) => {
  return (
    <Modal
      size={""}
      opened={isOpenMakeManager}
      onClose={closeMakeManager}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[550px] h-fit relative bg-white rounded-3xl p-4 pt-10 pb-4 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeMakeManager}
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
          <div className="w-full flex flex-col items-center">
            <Image src={managerSvg} alt="vector" width={200} height={50} />
            <h1 className="text-2xl font-extrabold text-center mt-4">
              Are you sure you want to make this employee {level} manager
            </h1>
            <h2 className="text-[#000F2369] text-lg font-medium text-center mt-4">
              This employee will be able to manage the {level} staff.
            </h2>
          </div>
          <div className="w-full flex justify-center mt-4 space-x-4 p-6">
            <button
              type="button"
              onClick={closeMakeManager}
              className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-full px-4 py-3 bg-[#005DE9F2] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Make Manager
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MakeManager;
