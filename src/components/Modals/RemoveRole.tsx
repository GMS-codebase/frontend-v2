import { Modal, Select, Text } from "@mantine/core";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import SideVector1 from "@/assets/Vectors/redSideVector.svg";
import SideVector2 from "@/assets/Vectors/redSideVector2.svg";
import deleteSvg from "@/assets/Vectors/delete.svg";
import { useState } from "react";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import { getRoles } from "@/utils/funcs";

const RemoveRole = ({
  isOpen,
  closeModal,
  role,
}: {
  role: any;
  isOpen: boolean;
  closeModal: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const handleRemove = () => {
    console.log("role", role);
    setIsLoading(true);
    authorizedApi
      .delete(`/roles/${role.uuid}`)
      .then((res) => {
        getRoles(dispatch);
        console.log(res.data);
        notifications.show({
          message: "Role is removed successfully",
          color: "blue",
        });
        closeModal();
      })
      .catch((err) => {
        console.log(err.response);
        notifications.show({
          title: "Failed to remove role",
          message: err.response.data.message ?? "",
          color: "red",
        });
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <Modal
      size={""}
      opened={isOpen}
      onClose={closeModal}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[550px] h-fit relative bg-white rounded-3xl p-4 pt-10 pb-4 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeModal}
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
            <Image src={deleteSvg} alt="vector" width={200} height={50} />
            <h1 className="text-2xl font-extrabold text-center">
              Are you sure you want to delete this role?
            </h1>
            <h2 className="text-[#000F2369] text-lg font-medium text-center">
              Role {role.role} will be removed
            </h2>
          </div>
          <div className="w-full flex justify-center mt-4 space-x-4 p-6">
            <button
              type="button"
              onClick={closeModal}
              className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="w-full px-4 py-3 bg-[#C50D0DF2] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {isLoading ? "Deleting . . ." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveRole;
