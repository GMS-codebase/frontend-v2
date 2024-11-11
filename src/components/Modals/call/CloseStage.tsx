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

const CloseStageModal = ({
  closeModal,
  call,
  data,
}: {
  closeModal: () => void;
  call: any;
  data: {
    opened: boolean;
    stage: string;
  };
}) => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const handleCloseStage = async () => {
    setLoading(true);
    authorizedApi
      .post(`/call/close-stage`, { call: call?.title, stage: data?.stage })
      .then((res) => {
        notifications.show({
          title: "Closed Stage Successfully!",
          message: res.data.message,
        });
        getCalls(dispatch);
        closeModal();
      })
      .catch((err) => {
        notifications.show({
          title: "Failed to close stage!",
          message: err.response.data.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      size=""
      opened={data.opened}
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
              Are you sure you want to close this stage?
            </h1>
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
              onClick={handleCloseStage}
              type="button"
              disabled={loading}
              className="w-full px-4 py-3 bg-primary text-white rounded-full shadow-sm  2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Close Stage"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CloseStageModal;
