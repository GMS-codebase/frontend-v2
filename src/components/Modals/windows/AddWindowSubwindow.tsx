import { Modal, MultiSelect, Select, Stepper } from "@mantine/core";
import { FormEvent, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Folder2, Subtitles } from "solar-icon-set";
import {
  SolarAddSquareBold,
  SolarSuitcaseLinear,
} from "@/components/core/icons";
import { useDispatch, useSelector } from "react-redux";
import { notifications } from "@mantine/notifications";
import { useParams, useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import AddSector from "../AddSector";
import { authorizedApi } from "@/utils/api";
import { ADD_SUB_WINDOW_SUCCESS } from "@/actions/WindowsActions";

const AddWindowSubwindow = ({
  isOpenAddWindowSubwindow,
  closeAddWindowSubwindow,
}: {
  isOpenAddWindowSubwindow: boolean;
  closeAddWindowSubwindow: () => void;
}) => {
  const { id: windowId } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const [active, setActive] = useState(0);
  const [isAddSector, { open, close }] = useDisclosure(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sectors: [],
  });
  const [selectedSelectors, setSelectedSelectors] = useState<any>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sectors = useSelector((state: any) => state.sectors);
  const MultiSelectData = sectors?.sectors?.map((sector: any) => ({
    value: sector.uuid,
    label: sector.name,
  }));

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevData) => ({
      ...prevData,
      [name]: null,
    }));
  };

  const validateStep = () => {
    let tempErrors: { [key: string]: string } = {};
    if (active === 0) {
      if (!formData.title) tempErrors.title = "Title is required";
      if (!formData.description)
        tempErrors.description = "Description is required";
    } else if (active === 1 && selectedSelectors.length === 0) {
      tempErrors.sectors = "At least one sector must be selected";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setActive((current) => (current < 3 ? current + 1 : current));
    }
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = () => {
    if (validateStep()) {
      setIsSubmitting(true);
      authorizedApi
        .post(`/sub-window/create/${windowId}`, {
          title: formData.title,
          description: formData.description,
          sectors: selectedSelectors,
        })
        .then((res) => {
          notifications.show({
            message: "Sub window is created successfully",
            color: "blue",
          });
          console.log(res.data.data);
          dispatch({
            type: ADD_SUB_WINDOW_SUCCESS,
            payload: { windowId: windowId, data: res.data.data.data },
          });
          resetForm();
          closeAddWindowSubwindow();
        })
        .catch((err) => {
          notifications.show({
            message: err.response?.data?.message?.includes("duplicate key")
              ? "Failed to create sub window! A sub window with the same title may already exist."
              : err.response?.data?.message ?? "Failed to create sub window!",
            color: "red",
          });
        })
        .finally(() => setIsSubmitting(false));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      sectors: [],
    });
    setSelectedSelectors([]);
    setActive(0);
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    closeAddWindowSubwindow();
  };

  return (
    <Modal
      size={""}
      opened={isOpenAddWindowSubwindow}
      onClose={closeAddWindowSubwindow}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[600px] h-fit relative bg-white rounded-3xl pt-10 pb-10 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={handleCancel}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">Add Sub-window</h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            Provide the Sub-window details to create a new sub-window.
          </h2>
        </div>
        <div className="w-[90%] flex flex-col items-center mt-4 overflow-hidden">
          <Stepper active={active} onStepClick={setActive} className="w-full">
            <Stepper.Step label="Sub-window details" className="text-xs">
              <div className="w-full overflow-y-auto flex flex-col gap-2 px-2">
                <div className="w-full flex justify-between gap-3">
                  <div className="w-full">
                    <label
                      htmlFor="TradeTitle"
                      className="block text-base font-medium text-black"
                    >
                      Title
                    </label>
                    <div className="w-full relative">
                      <span className="absolute left-2 top-[10px]">
                        <Folder2 />
                      </span>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        placeholder="Title"
                        onChange={handleChange}
                        className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                        required
                      />
                      {errors.title && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.title}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="">
                  <label
                    htmlFor="description"
                    className="block text-base font-medium text-black"
                  >
                    Description
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Subtitles />
                    </span>
                    <textarea
                      name="description"
                      value={formData.description}
                      placeholder="Add description"
                      onChange={handleChange}
                      className="mt-1 block w-full pb-28 pt-2 pl-8 px-3  bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                      required
                    />
                    {errors.description && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="w-full flex justify-center mt-4 space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Next
                  </button>
                </div>
              </div>
            </Stepper.Step>

            <Stepper.Step
              label="Related sectors"
              description=""
              className="text-xs"
            >
              <div className="w-full overflow-y-auto flex flex-col gap-5 px-2">
                <div className="w-full">
                  <label
                    htmlFor="trade"
                    className="block text-base font-medium text-black"
                  >
                    Sectors
                  </label>
                  <div className="mt-1 pl-6 relative block w-full bg-[#000F230A] py-1 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <span className="absolute left-2 top-3 text-black text-lg">
                      <SolarSuitcaseLinear />
                    </span>
                    <MultiSelect
                      name="sectors"
                      disabled={!MultiSelectData}
                      onChange={setSelectedSelectors}
                      data={
                        MultiSelectData.length
                          ? MultiSelectData
                          : [
                              {
                                value: "NO SECTOR",
                                label: "No Sectors Created",
                                disabled: true,
                              },
                            ]
                      }
                      value={selectedSelectors}
                      placeholder="Choose Sectors"
                      className="w-full pl-7"
                    />
                    {errors.sectors && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.sectors}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex justify-center mt-3">
                    <button
                      className="w-1/3 px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={open}
                    >
                      Add Sector
                    </button>
                  </div>
                </div>
                <div className="w-full flex justify-center mt-4 space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isSubmitting ? "bg-gray-500" : "bg-blue-500"
                    } text-white`}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </Stepper.Step>
          </Stepper>
        </div>
      </div>
      {/* <AddSector opened={isAddSector} close={close} dispatch={dispatch} /> */}
    </Modal>
  );
};

export default AddWindowSubwindow;
