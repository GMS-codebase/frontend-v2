import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import Woman from "../../assets/Images/woman.png";

const SuccessModal = ({
    opened,
    close,
}: {
    opened: boolean;
    close: () => void;
}) => {
    // const [opened, { open, close }] = useDisclosure(true); // Open by default

    return (
        <Modal
            size={"md"}
            opened={opened}
            onClose={close}
            withCloseButton={false}
            centered
            className=" size-6 flex flex-col gap-4 rounded-full"
        >
            {/* Close Icon */}
            <div className="w-full h-full  flex flex-col gap-2 align-middle rounded-3xl bg-white p-8 relative ">
                <div className="absolute top-3 right-3 m-4 text-center mt-0">
                    <button
                        onClick={close}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <IoMdClose size={24} />
                    </button>
                </div>

                <div className=" flex flex-col gap-2 text-center font-bold mb-4 justify-center items-center">
                    <Image src={Woman} alt="email" width={200} height={200} />
                </div>
                <div className="flex flex-col justify-center items-center text-center gap-4">
                    <h3 className="font-bold w-[90%] text-2xl">
                        You are selected in the evaluation stage
                    </h3>
                    <div className="text-gray-500  w-[70%]">
                        <p>Feel free to close this pop-up.</p>
                    </div>
                </div>

                <div
                    className="text-white bg-primary rounded-2xl py-2 font-semibold text-xl text-center mt-2 cursor-pointer"
                    onClick={close}
                >
                    Got it
                </div>
            </div>
        </Modal>
    );
};

export default SuccessModal;
