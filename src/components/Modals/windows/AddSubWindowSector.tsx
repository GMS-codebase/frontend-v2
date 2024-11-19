import { Modal, Select, MultiSelect } from "@mantine/core";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { SolarSuitcaseLinear, SolarWindowFrameLinear } from "../../core/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { getWindows } from "@/utils/funcs";
import {
  ADD_TRADE_SECTOR_SUCCESS,
  UPDATE_SECTOR_SUCCESS,
} from "@/actions/SectorsActions";

const AddSubWindowSector = ({
  isOpenAddSubWindowSector,
  closeAddSubWindowSector,
}: {
  isOpenAddSubWindowSector: boolean;
  closeAddSubWindowSector: () => void;
}) => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sector: [] as string[],
  });
  const [errors, setErrors] = useState({
    sector: "",
  });

  const sectors = useSelector((state: any) => state.sectors);
  const dispatch = useDispatch();

  const sectorOptions = sectors.sectors.map((sector: any) => ({
    value: sector.uuid,
    label: sector.name,
  }));

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.sector) newErrors.sector = "Sector is required";
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
      await authorizedApi.put(`/subwindow/${id}/assign-sector`, {
        sectorId: formData.sector,
      });
      // dispatch({
      //   type: ADD_TRADE_SECTOR_SUCCESS,
      //   payload: {
      //     sectorId: id,
      //     sector: sectors.sectors.find((tr: any) => tr.uuid === sectorId),
      //   },
      // });
      notifications.show({
        message:
          "Sector assigned to sector for all selected windows successfully!",
        color: "blue",
      });
      setFormData({
        sector: [],
      });
      getWindows(dispatch)
      closeAddSubWindowSector();
    } catch (error: any) {
      notifications.show({
        message: error.response?.data?.message ?? "Failed to assign sector!",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      size={""}
      opened={isOpenAddSubWindowSector}
      onClose={closeAddSubWindowSector}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[45vw] max-h-[90vh] overflow-y-auto relative bg-white rounded-3xl flex flex-col items-center p-16">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={closeAddSubWindowSector}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">Add Sector To Sub Window</h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            Attach a sector to subwindow
          </h2>
        </div>
        <div className="w-full flex flex-col items-center mt-10 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-5 px-2"
          >
            <div className="w-full">
              <label
                htmlFor="sector"
                className="block text-base font-medium text-black"
              >
                Select Sector
              </label>
              <div className="mt-1 pl-6 relative block w-full bg-[#000F230A] py-1 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <span className="absolute left-2 top-3 text-black text-lg">
                  <SolarSuitcaseLinear />
                </span>
                <MultiSelect
                  name="sector"
                  value={formData.sector}
                  onChange={(value: any) => handleChange("sector", value)}
                  data={sectorOptions}
                  placeholder="Type in or select sector"
                  required
                />
              </div>
              {errors.sector && (
                <div className="text-red-600 text-sm mt-1">{errors.sector}</div>
              )}
            </div>

            <div className="w-full flex justify-center mt-4 space-x-4">
              <button
                type="button"
                onClick={closeAddSubWindowSector}
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

export default AddSubWindowSector;
