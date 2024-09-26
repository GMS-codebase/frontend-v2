import { Modal, Select, Text } from "@mantine/core";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import SideVector1 from "@/assets/Vectors/redSideVector.svg";
import SideVector2 from "@/assets/Vectors/redSideVector2.svg";
import deleteSvg from "@/assets/Vectors/delete.svg";
import { useState } from "react";
import { authorizedApi } from "@/utils/api";
import { getRoles } from "@/utils/funcs";
import { useDispatch } from "react-redux";
import { notifications } from "@mantine/notifications";

const RemoveUserFromRole = ({
  role,
  isOpen,
  user,
  closeModal,
}: {
  role: any;
  isOpen: boolean;
  user: any;
  closeModal: () => void;
}) => {
  const [selectedSector, setSelectedSector] = useState("");
  const dispatch = useDispatch();
  const handleRemove = () => {
    authorizedApi
      .delete(`/roles/removeUser/${role}/${user?.uuid}`)
      .then((res) => {
        console.log(res.data);
        getRoles(dispatch);
        notifications.show({
          message: "User removed successfully",
          color: "blue",
        });
        closeModal();
      })
      .catch((err) => {
        console.log(err);
        notifications.show({
          title: "Failed to remove user",
          message: err.response?.data?.message ?? "",
          color: "red",
        });
      });
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
              Are you sure you want to remove this user from this role?
            </h1>
            <h2 className="text-[#000F2369] text-lg font-medium text-center">
              {user?.email} will be removed
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
              Remove
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveUserFromRole;
