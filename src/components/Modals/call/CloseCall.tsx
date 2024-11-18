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
import { getCalls } from "@/utils/funcs";

const CloseCallModal = ({
  isOpenModal,
  closeModal,
}: {
  isOpenModal: boolean;
  closeModal: () => void;
}) => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const closeCall = async () => {
    setLoading(true);
    setError(null);
    try {
      await authorizedApi.post(`/call/close-call-manually/${id}`);
      notifications.show({
        message: "Call closed successfully",
        color: "blue",
      });
      getCalls(dispatch);
      closeModal();
    } catch (error: any) {
      setError(
        error.response?.data?.message ?? "Error while nullifying decision",
      );
      notifications.show({ message: error.message, color: "red" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      size=""
      opened={isOpenModal}
      onClose={closeModal}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[550px] h-[400px] relative bg-white rounded-3xl p-4 pt-10 pb-4 flex flex-col items-center">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={closeModal}
        >
          <IoMdClose size={25} color="#000" />
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
              Are you sure you want to close this call?
            </h1>
            {/* <h2 className="text-[#000F2369] text-lg font-medium text-center">
              This action may affect related records or data.
            </h2> */}
            {/* {error && <p className="text-red-500 text-center mt-2">{error}</p>} */}
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
              onClick={closeCall}
              type="button"
              disabled={loading}
              className="w-full px-4 py-3 bg-primary text-white rounded-full shadow-sm  2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Close Call"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CloseCallModal;
