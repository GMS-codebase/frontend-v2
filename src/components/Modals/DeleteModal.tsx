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
import {
  DELETE_SUB_WINDOW_SUCCESS,
  DELETE_WINDOW_SUCCESS,
} from "@/actions/WindowsActions";
import { DELETE_SECTOR_SUCCESS } from "@/actions/SectorsActions";
import { DELETE_TRADE_SUCCESS } from "@/actions/TradesActions";
import { DELETE_CALL_SUCCESS } from "@/actions/CallsActions";
import { DELETE_CONTACT_SUCCESS } from "@/actions/ContactsActions";
import { DELETE_EMPLOYEE_SUCCESS } from "@/actions/EmployeesActions";
import { DELETE_BUDGET_LINE_SUCCESS } from "@/actions/BudgetLinesActions";
import { DELETE_FORM_SUCCESS } from "@/actions/FormsActions";
import { DELETE_SURVEY_SUCCESS } from "@/actions/SurveyActions";

// Redux action mappings
const actionMappings = {
  windows: DELETE_WINDOW_SUCCESS,
  sectors: DELETE_SECTOR_SUCCESS,
  trades: DELETE_TRADE_SUCCESS,
  subwindows: DELETE_SUB_WINDOW_SUCCESS,
  calls: DELETE_CALL_SUCCESS,
  contacts: DELETE_CONTACT_SUCCESS,
  employees: DELETE_EMPLOYEE_SUCCESS,
  budgetLines: DELETE_BUDGET_LINE_SUCCESS,
  forms: DELETE_FORM_SUCCESS,
  trainings: DELETE_FORM_SUCCESS,
  surveys: DELETE_SURVEY_SUCCESS, // Added surveys action mapping
};

const routeMappings = {
  windows: "/window",
  sectors: "/Sectors",
  trades: "/trade",
  subwindows: "/sub-window",
  calls: "/call",
  contacts: "/contacts",
  employees: "/employees",
  budgetLines: "/budgetlines/delete",
  forms: "/forms/delete",
  trainings: "/trainings/delete",
  surveys: "/survey/remove", // Updated to use correct survey delete endpoint
};

type DeleteType =
  | "windows"
  | "sectors"
  | "trades"
  | "subwindows"
  | "calls"
  | "contacts"
  | "employees"
  | "budgetLines"
  | "forms"
  | "trainings"
  | "surveys"; // Added surveys to the type

const DeleteModal = ({
  isOpenModal,
  closeModal,
  id,
  windowId,
  type,
}: {
  isOpenModal: boolean;
  closeModal: () => void;
  id: string;
  windowId?: string;
  type: DeleteType;
}) => {
  const dispatch = useDispatch();
  const [deleteId, setDeleteId] = useState(id);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDeleteId(id);
  }, [id]);

  const onDelete = () => {
    setLoading(true);
    authorizedApi
      .delete(`${routeMappings[type]}/${deleteId}`)
      .then(() => {
        notifications.show({
          message: `${capitalize(type.slice(0, -1))} is deleted successfully`,
          color: "blue",
        });
        dispatch({
          type: actionMappings[type],
          payload:
            type === "subwindows" ? { windowId, data: { uuid: id } } : { id },
        });
        closeModal();
      })
      .catch((err) => {
        notifications.show({
          message:
            err.response?.data?.message ??
            `Failed to delete ${capitalize(type.slice(0, -1))}!`,
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
      <div className="lg:w-[40vw] lg:max-h-[90vh] overflow-y-auto overflow-x-hidden relative bg-white rounded-3xl p-10 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeModal}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <Image
          src={SideVector1 || "/placeholder.svg"}
          alt="vector"
          className="absolute bottom-[3rem] right-[-2rem] h-32"
          width={100}
          height={50}
        />
        <Image
          src={SideVector2 || "/placeholder.svg"}
          alt="vector"
          className="absolute top-[3rem] left-[-2rem] h-32"
          width={100}
          height={50}
        />
        <div className="w-4/5 flex flex-col items-center mt-4 overflow-hidden">
          <div className="w-full flex flex-col items-center">
            <Image
              src={deleteSvg || "/placeholder.svg"}
              alt="vector"
              width={200}
              height={50}
            />
            <h1 className="text-2xl font-extrabold text-center">
              Are you sure you want to delete this{" "}
              {capitalize(type.slice(0, -1))}?
            </h1>
            <h2 className="text-[#000F2369] text-lg font-medium text-center">
              All the data concerned with this {capitalize(type.slice(0, -1))}{" "}
              might be deleted or harmed
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
              {loading ? "Loading" : `Delete ${capitalize(type.slice(0, -1))}`}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
