import { Modal } from "@mantine/core";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FiCheck, FiX } from "react-icons/fi";
import SideVector1 from "@/assets/Vectors/sidevecto.svg";
import SideVector2 from "@/assets/Vectors/sidevector2.svg";
import { notifications } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import { authorizedApi } from "@/utils/api";
import Image from "next/image";
import { getApplications, getContracts } from "@/utils/funcs";

type EntityType = "paid" | "unpaid";

interface MarkAsPaidOrUnpaidModalProps {
  isOpenModal: boolean;
  closeModal: () => void;
  id: string;
  type: EntityType;
  contractId: string
}
const MarkAsPaidOrUnpaidModal: React.FC<MarkAsPaidOrUnpaidModalProps> = ({
  isOpenModal,
  closeModal,
  id,
  contractId,
  type,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onToggleStatus = async () => {
    setLoading(true);
    try {
      await authorizedApi.get(
        `/negotiation-contract/contracts/sdf/${type === "paid" ? "pay": "unpay"}/${contractId}/${id}`,
      );
      notifications.show({
        message: `Installment marked as ${type} successfully`,
        color: "green",
      });
      closeModal();
      getApplications(dispatch)
      getContracts(dispatch)
    } catch (err: any) {
      notifications.show({
        message:
          err.response?.data?.message ??
          `Failed to mark installment as ${type}!`,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      size="md"
      opened={isOpenModal}
      onClose={closeModal}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-full h-full overflow-y-auto overflow-x-hidden relative bg-white rounded-3xl p-10 flex flex-col items-center">
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
        <div className="w-full flex flex-col items-center mt-4 overflow-hidden">
          <div className="w-full flex flex-col items-center">
            {type === "paid" ? (
              <FiCheck size={100} color="#22c55e" className="mb-4" />
            ) : (
              <FiX size={100} color="#ef4444" className="mb-4" />
            )}
            <h1 className="text-2xl font-extrabold text-center">
              Are you sure you want to mark this installment as {type}?
            </h1>
          </div>
          <div className="w-full flex justify-center mt-4 space-x-2 py-6 px-8">
            <button
              type="button"
              onClick={closeModal}
              className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={onToggleStatus}
              type="button"
              disabled={loading}
              className="w-full px-4 py-3 bg-primary text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed truncate"
            >
              {loading
                ? "Processing..."
                : `Mark as ${type}`}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MarkAsPaidOrUnpaidModal;
