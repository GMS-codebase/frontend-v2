import { Modal, Select, MultiSelect } from "@mantine/core";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { SolarSuitcaseLinear, SolarWindowFrameLinear } from "../../core/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import {
  ADD_TRADE_SECTOR_SUCCESS,
  UPDATE_SECTOR_SUCCESS,
} from "@/actions/SectorsActions";

const AddSectorTrade = ({
  isOpenAddSectorTrade,
  closeAddSectorTrade,
}: {
  isOpenAddSectorTrade: boolean;
  closeAddSectorTrade: () => void;
}) => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    trade: "",
    windows: [] as string[], // Changed window to windows as an array
  });
  const [errors, setErrors] = useState({
    trade: "",
    windows: "",
  });

  const windows = useSelector((state: any) => state.windows);
  const trades = useSelector((state: any) => state.trades);
  const dispatch = useDispatch();

  const tradeOptions = trades.trades.map((trade: any) => ({
    value: trade.uuid,
    label: trade.title,
  }));

  const windowOptions = windows.windows
    .filter((window: any) =>
      window.subWindows.filter((subWindow: any) =>
        subWindow.sectors.filter((sec: any) => sec.uuid === id),
      ),
    )
    .map((window: any) => ({
      value: window.title,
      label: window.title,
    }));

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.trade) newErrors.trade = "Trade is required";
    if (!formData.windows.length)
      newErrors.windows = "At least one window is required"; // Validate for at least one window
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };



  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await authorizedApi.put(`/Sectors/${id}/assign-trade`, {
        tradeId:formData.trade,
        windows:formData.windows,
      });
      // dispatch({
      //   type: ADD_TRADE_SECTOR_SUCCESS,
      //   payload: {
      //     sectorId: id,
      //     trade: trades.trades.find((tr: any) => tr.uuid === tradeId),
      //   },
      // });
      notifications.show({
        message:
          "Trade assigned to sector for all selected windows successfully!",
        color: "blue",
      });
      closeAddSectorTrade();
    } catch (error: any) {
      console.log(error);
      notifications.show({
        message: error.response?.data?.message ?? "Failed to assign trade!",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      size={""}
      opened={isOpenAddSectorTrade}
      onClose={closeAddSectorTrade}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[45vw] max-h-[90vh] overflow-y-auto relative bg-white rounded-3xl flex flex-col items-center p-16">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={closeAddSectorTrade}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">Add Trade To Sector</h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            Provide the sector and window details to add a new trade.
          </h2>
        </div>
        <div className="w-full flex flex-col items-center mt-10 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-5 px-2"
          >
            <div className="w-full">
              <label
                htmlFor="trade"
                className="block text-base font-medium text-black"
              >
                Select Trade
              </label>
              <div className="mt-1 pl-6 relative block w-full bg-[#000F230A] py-1 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <span className="absolute left-2 top-3 text-black text-lg">
                  <SolarSuitcaseLinear />
                </span>
                <Select
                  name="trade"
                  value={formData.trade}
                  onChange={(value: any) => handleChange("trade", value)}
                  data={tradeOptions}
                  placeholder="Type in or select trade"
                  required
                />
              </div>
              {errors.trade && (
                <div className="text-red-600 text-sm mt-1">{errors.trade}</div>
              )}
            </div>

            <div className="w-full">
              <label
                htmlFor="windows"
                className="block text-base font-medium text-black"
              >
                Select Windows
              </label>
              <div className="mt-1 pl-6 relative block w-full bg-[#000F230A] py-1 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <span className="absolute left-2 top-3 text-black text-lg">
                  <SolarWindowFrameLinear />
                </span>
                <MultiSelect
                  name="windows"
                  value={formData.windows}
                  onChange={(value: string[]) => handleChange("windows", value)}
                  data={windowOptions}
                  placeholder="Type in or select windows"
                  required
                />
              </div>
              {errors.windows && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.windows}
                </div>
              )}
            </div>

            <div className="w-full flex justify-center mt-4 space-x-4">
              <button
                type="button"
                onClick={closeAddSectorTrade}
                className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-3 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  loading ? "bg-gray-400" : "bg-blue-500"
                }`}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddSectorTrade;
