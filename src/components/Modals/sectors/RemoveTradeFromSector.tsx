import { Modal } from "@mantine/core";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import SideVector1 from "@/assets/Vectors/redSideVector.svg";
import SideVector2 from "@/assets/Vectors/redSideVector2.svg";
import deleteSvg from "@/assets/Vectors/delete.svg";
import { notifications } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import { authorizedApi } from "@/utils/api";
import { useParams } from "next/navigation";
import { tradesData } from "@/utils/constants/dummy";

const RemoveTradeFromSectorModal = ({
  isOpenModal,
  closeModal,
  tradeId,
}: {
  isOpenModal: boolean;
  closeModal: () => void;
  tradeId: string;
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const onDelete = () => {
    setLoading(true);
    authorizedApi
      .put(`/Sectors/${id}/remove-trade`, {
        tradeId,
      })
      .then(() => {
        notifications.show({
          message: `Trade is removed successfully`,
          color: "blue",
        });
        // dispatch({
        //   type: ,
        //   payload:
        //     type === "subwindows" ? { windowId, data: { uuid: id } } : { id },
        // });
        closeModal();
      })
      .catch((err) => {
        notifications.show({
          message:
            err.response?.data?.message ??
            `Failed to remove trade from sector!`,
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const capitalize = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1);

  return (
    <Modal
      size={""}
      opened={isOpenModal}
      onClose={closeModal}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[550px] h-[400px] relative bg-white rounded-3xl p-4 pt-10 pb-4 flex flex-col items-center">
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
              Are you sure you want to remove this trade from the sector
            </h1>
            <h2 className="text-[#000F2369] text-lg font-medium text-center">
              All the data concerned with this might be deleted or harmed
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
              onClick={onDelete}
              type="button"
              disabled={loading}
              className="w-full px-4 py-3 bg-[#C50D0DF2] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading" : `Remove`}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveTradeFromSectorModal;
