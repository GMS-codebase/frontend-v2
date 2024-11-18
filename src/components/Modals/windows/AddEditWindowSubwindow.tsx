import { Modal, MultiSelect, Stepper } from "@mantine/core";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Folder2, Subtitles } from "solar-icon-set";
import { SolarSuitcaseLinear } from "@/components/core/icons";
import { useDispatch, useSelector } from "react-redux";
import { notifications } from "@mantine/notifications";
import { useParams } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import AddEditSector from "../sectors/AddEditSector";
import {
  ADD_SUB_WINDOW_SUCCESS,
  UPDATE_SUB_WINDOW_SUCCESS,
} from "@/actions/WindowsActions";
import { authorizedApi } from "@/utils/api";

const AddEditWindowSubwindow = ({
  isOpenAddEditWindowSubwindow,
  closeAddEditWindowSubwindow,
  defaultData = null,
}: {
  isOpenAddEditWindowSubwindow: boolean;
  closeAddEditWindowSubwindow: () => void;
  defaultData?: any;
}) => {
  const { id: windowId } = useParams();
  const dispatch = useDispatch();

  const [active, setActive] = useState(0);
  const [isAddSector, { open: openAddSector, close: closeAddSector }] =
    useDisclosure(false);
  const [formData, setFormData] = useState({
    title: defaultData?.title || "",
    description: defaultData?.description || "",
    sectors: defaultData?.sectors || [],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sectors = useSelector((state: any) => state.sectors);
  const MultiSelectData = sectors?.sectors?.map((sector: any) => ({
    value: sector.name,
    label: sector.name,
  }));

  useEffect(() => {
    if (defaultData) {
      setFormData({
        title: defaultData.title,
        description: defaultData.description,
        sectors: defaultData.sectors.map((sec: any) => sec.name),
      });
    }
  }, [defaultData]);

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
    } else if (active === 1) {
      if (!formData.sectors.length)
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

  const handleSubmit = async () => {
    if (validateStep()) {
      setIsSubmitting(true);
      try {
        const response = defaultData
          ? await authorizedApi.patch(
              `/sub-window/${defaultData.uuid}`,
              formData,
            )
          : await authorizedApi.post(
              `/sub-window/create/${windowId}`,
              formData,
            );

        notifications.show({
          message: defaultData
            ? "Sub window updated successfully"
            : "Sub window created successfully",
          color: "blue",
        });

        dispatch({
          type: defaultData
            ? UPDATE_SUB_WINDOW_SUCCESS
            : ADD_SUB_WINDOW_SUCCESS,
          payload: {
            windowId: windowId,
            data: response.data.data.data,
          },
        });
        resetForm();
        closeAddEditWindowSubwindow();
      } catch (err: any) {
        notifications.show({
          message: err.response?.data?.message?.includes("duplicate key")
            ? "Failed to save sub-window! A sub-window with the same title may already exist."
            : (err.response?.data?.message ?? "Failed to save sub-window!"),
          color: "red",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      sectors: [],
    });
    setActive(0);
    setErrors({});
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    resetForm();
    closeAddEditWindowSubwindow();
  };

  return (
    <Modal
      size={""}
      opened={isOpenAddEditWindowSubwindow}
      onClose={closeAddEditWindowSubwindow}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[600px] max-h-[90vh] overflow-y-auto modal  relative bg-white rounded-3xl pt-10 pb-10 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={handleCancel}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">
            {defaultData ? "Update Sub-window" : "Add Sub-window"}
          </h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            {defaultData
              ? "Update the Sub-window details."
              : "Provide the Sub-window details to create a new sub-window."}
          </h2>
        </div>
        <div className="w-[90%] flex flex-col items-center mt-4 ">
          <Stepper
            active={active}
            onStepClick={setActive}
            className="w-full"
            allowNextStepsSelect={false}
          >
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
                        value={formData?.title}
                        placeholder="Title"
                        onChange={handleChange}
                        className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                        required
                      />
                      {errors?.title && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors?.title}
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
              <div className="w-full flex flex-col gap-2 px-2">
                <div className="">
                  <label
                    htmlFor="sectors"
                    className="block text-base font-medium text-black"
                  >
                    Sectors
                  </label>
                  <div className="w-full">
                    <MultiSelect
                      value={formData.sectors}
                      onChange={(value) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          sectors: value,
                        }))
                      }
                      data={MultiSelectData}
                      placeholder="Select sectors"
                      searchable
                      clearable
                      rightSection={<SolarSuitcaseLinear />}
                      className="bg-[#000F230A] rounded-2xl"
                    />
                    {errors.sectors && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.sectors}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex justify-end my-5 space-x-4">
                    <button
                      type="button"
                      onClick={openAddSector}
                      className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Add New Sector
                    </button>
                  </div>
                  <div className="w-full flex justify-between gap-3">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? defaultData
                          ? "Updating..."
                          : "Creating..."
                        : defaultData
                          ? "Update"
                          : "Create"}
                    </button>
                  </div>
                </div>
              </div>
            </Stepper.Step>
          </Stepper>
        </div>
      </div>
      <AddEditSector
        closeAddEditSector={closeAddSector}
        isOpenAddEditSector={isAddSector}
      />
    </Modal>
  );
};

export default AddEditWindowSubwindow;
