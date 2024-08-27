import { Modal, MultiSelect, Select, Stepper } from "@mantine/core";
import { FormEvent, useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { Folder2, Subtitles } from "solar-icon-set";
import { SolarSuitcaseLinear, SolarUploadBold } from "../core/icons";
import { CalendarMinimalistic } from "solar-icon-set";
import { ShieldWarning } from "solar-icon-set";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { SolarCheckCircleBold } from "../core/icons";
import { useSelector } from "react-redux";
import { authorizedApi } from "@/utils/api";

type FormData = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  appealDays: string;
  windows: any;
  sectors: any;
  subWindows: any;
  attachment: File | null;
};

const AddCall = ({
  isOpenAddCall,
  closeAddCall,
}: {
  isOpenAddCall: boolean;
  closeAddCall: () => void;
}) => {
  const [active, setActive] = useState(0);
  const sectors = useSelector((state: any) => state.sectors);
  const windows = useSelector((state: any) => state.windows);
  console.log(windows);
  const [selectedWindows, setSelectedWindows] = useState<any>([]);
  const [selectedSubWindows, setSelectedSubWindows] = useState<any>([]);
  const [selectedSelectors, setSelectedSelectors] = useState<any>([]);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    appealDays: "",
    windows: [],
    subWindows: [],
    sectors: [],
    attachment: null,
  });

  const MultiWindowData = windows?.windows?.map((window: any) => ({
    value: window.uuid,
    label: window.title,
  }));

  const getSubWindowsData = () => {
    const subWindowData =
      windows?.windows
        ?.filter((window: any) => selectedWindows.includes(window.uuid))
        .flatMap((window: any) =>
          window.subWindows?.map((subWindow: any) => ({
            value: subWindow.uuid,
            label: subWindow.title,
          })),
        ) || [];
    console.log(subWindowData);
    return subWindowData;
  };

  const getSectorData = () => {
    const sectorData = windows?.windows?.flatMap(
      (window: any) =>
        window.subWindows
          ?.filter((subWindow: any) =>
            selectedSubWindows.includes(subWindow.uuid),
          )
          .flatMap((subWindow: any) =>
            subWindow.sectors?.map((sector: any) => ({
              value: sector.uuid,
              label: sector.name,
            })),
          ) || [],
    );
    return sectorData;
  };

  const MultiSubWindowData = getSubWindowsData();
  const MultiSectorData = getSectorData();

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = () => {
    setFormData({
      ...formData,
      sectors: selectedSelectors,
      windows: selectedWindows,
    });
    console.log(formData);
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("appealDays", formData.appealDays);
    submitData.append("applicationStartDate", formData.startDate);
    submitData.append("applicationEndDate", formData.endDate);
    submitData.append("window", JSON.stringify(selectedWindows));
    submitData.append("sector", JSON.stringify(selectedSelectors));
    submitData.append("subWindow", JSON.stringify(selectedSubWindows));
    if (formData.attachment) {
      submitData.append("attachment", formData.attachment);
    }
    authorizedApi
      .post("/call/create", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
        notifications.show({
          message: "Call created successfully!",
          color: "blue",
        });
        closeAddCall();
      })
      .catch((err) => {
        console.log(err.response);
        notifications.show({
          message: err.response?.data?.message ?? "Failed to create call!",
          color: "red",
        });
      });
  };

  return (
    <Modal
      size={""}
      opened={isOpenAddCall}
      onClose={closeAddCall}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[80vh] h-fit relative bg-white rounded-3xl pt-10 pb-10 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeAddCall}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center ">
          <h1 className="text-2xl font-extrabold">Create Call</h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            Provide your call details to create a new call.
          </h2>
        </div>
        <div className="w-full flex flex-col items-center mt-4 overflow-hidden px-[5%]">
          <Stepper active={active} onStepClick={setActive} className="w-full">
            <Stepper.Step label="Call detail" className="text-xs">
              <div className="w-full overflow-y-auto flex flex-col gap-2 px-2">
                <div className="w-full flex justify-between gap-3">
                  <div className="w-full">
                    <label
                      htmlFor="callTitle"
                      className="block text-xs font-bold text-gray-700"
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
                        placeholder="Call title"
                        onChange={handleChange}
                        className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="">
                  <label
                    htmlFor="description"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Description
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Subtitles />
                    </span>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      placeholder="Add description"
                      onChange={handleChange}
                      className="mt-1 block w-full h-full pl-8 px-3 pt-3 pb-8 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="">
                  <label
                    htmlFor="attachment"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Attachment
                  </label>
                  <div className="relative mt-1 flex flex-col items-center justify-center w-full h-[15vh] border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <label
                      htmlFor="attachment"
                      className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
                    >
                      {!formData.attachment ? (
                        <>
                          <SolarUploadBold className="text-blue-500 text-3xl" />
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Upload file</p>
                            <p className="text-xs text-gray-400">
                              or drag and drop
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <span>
                            <SolarCheckCircleBold />
                          </span>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">
                              File Uploaded
                            </p>
                            <p className="text-xs text-gray-400">
                              {formData?.attachment?.name}
                            </p>
                          </div>
                        </>
                      )}
                    </label>
                    <input
                      id="attachment"
                      type="file"
                      name="attachment"
                      accept=".pdf"
                      onChange={handleChange}
                      style={{ display: "none" }}
                      className="content-none"
                      required
                    />
                  </div>
                </div>

                <div className="w-full flex justify-center mt-4 space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={nextStep}
                    type="button"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Next
                  </button>
                </div>
              </div>
            </Stepper.Step>

            <Stepper.Step
              label="Timeline Details"
              description=""
              className="text-xs"
            >
              <div className="mt-4 w-full overflow-y-auto flex flex-col gap-2 px-2">
                <div className="w-full flex space-x-4">
                  <div className="w-1/2">
                    <label
                      htmlFor="startDate"
                      className="block text-xs font-bold text-gray-700"
                    >
                      Start Date
                    </label>
                    <div className="w-full relative">
                      <span className="absolute left-2 top-[10px]">
                        <CalendarMinimalistic />
                      </span>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="w-1/2">
                    <label
                      htmlFor="endDate"
                      className="block text-xs font-bold text-gray-700"
                    >
                      End Date
                    </label>
                    <div className="w-full relative">
                      <span className="absolute left-2 top-[10px]">
                        <CalendarMinimalistic />
                      </span>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <label
                    htmlFor="appealDays"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Appeal Days
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <ShieldWarning />
                    </span>
                    <input
                      type="text"
                      name="appealDays"
                      value={formData.appealDays}
                      placeholder="Appeal days"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="w-full flex justify-center mt-4 space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    type="button"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Next
                  </button>
                </div>
              </div>
            </Stepper.Step>

            <Stepper.Step
              label="Select options"
              description=""
              className="text-xs"
            >
              <div className="mt-4 w-full overflow-y-auto flex flex-col gap-2 px-2">
                <div className="">
                  <label
                    htmlFor="windows"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Select windows
                  </label>
                  <div className="mt-1 pl-6 relative block w-full bg-[#000F230A] py-1 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <span className="absolute left-2 top-3 text-black text-lg">
                      <SolarSuitcaseLinear />
                    </span>
                    <MultiSelect
                      name="windows"
                      onChange={(value) => {
                        setSelectedWindows(value);
                        setSelectedSubWindows([]);
                        setSelectedSelectors([]);
                      }}
                      data={MultiWindowData}
                      placeholder="Select or type in a window"
                      required
                    />
                  </div>
                </div>

                <div className="">
                  <label
                    htmlFor="subWindows"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Select sub-windows
                  </label>
                  <div className="mt-1 pl-6 relative block w-full bg-[#000F230A] py-1 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <span className="absolute left-2 top-3 text-black text-lg">
                      <SolarSuitcaseLinear />
                    </span>
                    <MultiSelect
                      name="subWindows"
                      onChange={(value) => {
                        setSelectedSubWindows(value);
                        setSelectedSelectors([]);
                      }}
                      data={MultiSubWindowData}
                      placeholder="Select or type in a sub-window"
                      required
                    />
                  </div>
                </div>

                <div className="">
                  <label
                    htmlFor="sectors"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Select sectors
                  </label>
                  <div className="mt-1 pl-6 relative block w-full bg-[#000F230A] py-1 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <span className="absolute left-2 top-3 text-black text-lg">
                      <SolarSuitcaseLinear />
                    </span>
                    <MultiSelect
                      name="sectors"
                      onChange={setSelectedSelectors}
                      data={MultiSectorData}
                      placeholder="Select or type in a sector"
                      required
                    />
                  </div>
                </div>
                <div className="w-full flex justify-center mt-4 space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Create Call
                  </button>
                </div>
              </div>
            </Stepper.Step>
          </Stepper>
        </div>
      </div>
    </Modal>
  );
};

export default AddCall;
