import { Modal } from "@mantine/core";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FiPower } from "react-icons/fi"; 
import SideVector1 from "@/assets/Vectors/sidevecto.svg";
import SideVector2 from "@/assets/Vectors/sidevector2.svg";
import { notifications } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import { authorizedApi } from "@/utils/api";
import {
  UPDATE_SUB_WINDOW_SUCCESS,
  UPDATE_WINDOW_SUCCESS,
} from "@/actions/WindowsActions";
import { UPDATE_SECTOR_SUCCESS } from "@/actions/SectorsActions";
import { UPDATE_TRADE_SUCCESS } from "@/actions/TradesActions";
import { UPDATE_BUDGET_LINE_SUCCESS } from "@/actions/BudgetLinesActions";
import Image from "next/image";
import {
  BUDGET_LINE_STATUS,
  SECTOR_STATUS,
  SUBWINDOW_STATUS,
  TRADE_STATUS,
  WINDOW_STATUS,
} from "@/utils/enums";

type EntityType =
  | "windows"
  | "sectors"
  | "trades"
  | "subwindows"
  | "budgetLines";

interface ActivateDeactivateModalProps {
  isOpenModal: boolean;
  closeModal: () => void;
  id: string;
  type: EntityType;
  isActive: boolean;
}

const actionMappings: Record<EntityType, string> = {
  windows: UPDATE_WINDOW_SUCCESS,
  sectors: UPDATE_SECTOR_SUCCESS,
  trades: UPDATE_TRADE_SUCCESS,
  subwindows: UPDATE_SUB_WINDOW_SUCCESS,
  budgetLines: UPDATE_BUDGET_LINE_SUCCESS,
};

const enumMappings = {
  windows: WINDOW_STATUS,
  sectors: SECTOR_STATUS,
  trades: TRADE_STATUS,
  subwindows: SUBWINDOW_STATUS,
  budgetLines: BUDGET_LINE_STATUS,
};

const routeMappings: Record<EntityType, string> = {
  windows: "/window",
  sectors: "/sectors",
  trades: "/trade",
  subwindows: "/sub-window",
  budgetLines: "/budgetlines",
};

const ActivateDeactivateModal: React.FC<ActivateDeactivateModalProps> = ({
  isOpenModal,
  closeModal,
  id,
  type,
  isActive,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const capitalize = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1);

  const onToggleStatus = async () => {
    setLoading(true);
    const action = isActive ? "deactivate" : "activate";

    try {
      await authorizedApi.put(
        `${routeMappings[type]}/activate-deactivate/${id}`
      );
      notifications.show({
        message: `${capitalize(type.slice(0, -1))} has been ${action}d successfully`,
        color: "blue",
      });
      dispatch({
        type: actionMappings[type],
        payload: {
          uuid: id,
          status: !isActive
            ? enumMappings[type].ACTIVE
            : enumMappings[type].INACTIVE,
        },
      });
      closeModal();
    } catch (err: any) {
      notifications.show({
        message:
          err.response?.data?.message ??
          `Failed to ${action} ${capitalize(type.slice(0, -1))}!`,
        color: "red",
      });
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
      <div className="w-[40vw] max-h-[90vh] overflow-y-auto overflow-x-hidden relative bg-white rounded-3xl p-10 flex flex-col items-center">
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
            <FiPower size={100} color="#1E90FF" className="mb-4" />{" "}
            {/* New Icon */}
            <h1 className="text-2xl font-extrabold text-center">
              Are you sure you want to {isActive ? "deactivate" : "activate"}{" "}
              this {capitalize(type.slice(0, -1))}?
            </h1>
            <h2 className="text-[#000F2369] text-lg font-medium text-center">
              This action will {isActive ? "deactivate" : "activate"} all
              services related to this {capitalize(type.slice(0, -1))}
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
              onClick={onToggleStatus}
              type="button"
              disabled={loading}
              className="w-full px-4 py-3 bg-primary text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : `${isActive ? "Deactivate" : "Activate"} ${capitalize(type.slice(0, -1))}`}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ActivateDeactivateModal;
