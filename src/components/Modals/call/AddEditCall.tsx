import { Modal, MultiSelect, Select, Stepper } from "@mantine/core";
import { FormEvent, useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { Folder2, Subtitles } from "solar-icon-set";
import { SolarSuitcaseLinear, SolarUploadBold } from "../../core/icons";
import { CalendarMinimalistic } from "solar-icon-set";
import { ShieldWarning } from "solar-icon-set";
import axios from "axios";
import { notifications } from "@mantine/notifications";
import { SolarCheckCircleBold } from "../../core/icons";
import { useDispatch, useSelector } from "react-redux";
import { authorizedApi } from "@/utils/api";
import { Call } from "@/types";
import { DatePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { getCalls } from "@/utils/funcs";
import { ADD_CALL_SUCCESS, UPDATE_CALL_SUCCESS } from "@/actions/CallsActions";
import {
  SECTOR_STATUS,
  SUBWINDOW_STATUS,
  TRADE_STATUS,
  WINDOW_STATUS,
} from "@/utils/enums";
import { tradesData } from "@/utils/constants/dummy";

const AddEditCall = ({
  isOpenAddEditCall,
  closeAddEditCall,
  defaultData,
}: {
  isOpenAddEditCall: boolean;
  closeAddEditCall: () => void;
  defaultData?: Call;
}) => {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>();
  const [selectedWindows, setSelectedWindows] = useState<any>([]);
  const [selectedForm, setSelectedForm] = useState<any>("");
  const [selectedSubWindows, setSelectedSubWindows] = useState<any>([]);
  const [selectedSectors, setSelectedSectors] = useState<any>([]);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<Partial<Call>>({
    title: "",
    description: "",
    startDate: '"',
    endDate: "",
    appealDays: "",
    windows: [],
    subWindows: [],
    sectors: [],
    attachment: null,
  });
  const windows = useSelector((state: any) => state.windows);
  const forms = useSelector((state: any) => state.forms);
  const { sectors } = useSelector((state: any) => state.sectors);
  let MultiWindowData =
    windows?.windows
      .filter(
        (window: any) =>
          window.subWindows.filter(
            (sub: any) => sub.status === SUBWINDOW_STATUS.ACTIVE
          ).length !== 0 && window.status === WINDOW_STATUS.ACTIVE
      )
      ?.map((window: any) => ({
        value: window.uuid,
        label: window.title,
      })) ?? [];

  const FormsData = forms.forms.map((form: any) => ({
    label: form.name,
    value: form.uuid,
  }));
  const getSubWindowsData = () => {
    const subWindowData =
      windows?.windows
        ?.filter((window: any) => selectedWindows?.includes(window.uuid))
        .flatMap((window: any) => {
          return (
            window.subWindows
              ?.filter(
                (sub: any) =>
                  sub.status === SUBWINDOW_STATUS.ACTIVE &&
                  sub.sectors.filter(
                    (sec: any) => sec.status === SECTOR_STATUS.ACTIVE
                  )
              )
              .map((subWindow: any) => ({
                value: subWindow.uuid,
                label: subWindow.title,
              })) || []
          );
        }) || [];

    return subWindowData;
  };

  const getSectorData = () => {
    const sectorData = windows?.windows?.flatMap(
      (window: any) =>
        window.subWindows
          ?.filter((subWindow: any) =>
            selectedSubWindows.includes(subWindow.uuid)
          )
          .flatMap(
            (subWindow: any) =>
              subWindow.sectors
                ?.map((sector: any) => {
                  const matchingSector = sectors.find(
                    (s: any) =>
                      s.uuid === sector.uuid &&
                      s.trades.filter(
                        (trad: any) => trad.trade.status === TRADE_STATUS.ACTIVE
                      ).length > 0 &&
                      sector.status === SECTOR_STATUS.ACTIVE
                  );
                  return matchingSector
                    ? {
                        value: matchingSector.uuid,
                        label: matchingSector.name,
                      }
                    : null;
                })
                .filter(Boolean) || []
          ) || []
    );
    return sectorData;
  };

  const MultiSubWindowData = getSubWindowsData();
  const MultiSectorData = getSectorData();
  useEffect(() => {
    if (defaultData) {
      setFormData(defaultData);
      setSelectedWindows(defaultData.windows.map((item: any) => item.uuid));
      setSelectedSubWindows(
        defaultData.subWindows.map((item: any) => item.uuid)
      );
      setSelectedForm(defaultData.form as any);
      setSelectedSectors(defaultData.sectors.map((item: any) => item.uuid));
    }
  }, [defaultData]);
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
    setLoading(true);
    setFormData({
      ...formData,
      sectors: selectedSectors,
      windows: selectedWindows,
    });
    const submitData = new FormData();
    submitData.append("title", formData?.title as any);
    submitData.append("description", formData?.description as any);
    submitData.append("appealDays", formData?.appealDays as any);
    submitData.append("applicationStartDate", formData?.startDate as any);
    submitData.append("applicationEndDate", formData?.endDate as any);
    submitData.append("window", JSON.stringify(selectedWindows));
    submitData.append("form", selectedForm);
    submitData.append("sector", JSON.stringify(selectedSectors));
    submitData.append("subWindows", JSON.stringify(selectedSubWindows));
    if (formData?.attachment) {
      submitData?.append("attachment", formData?.attachment);
    }

    const apiUrl = defaultData
      ? `/call/update/${defaultData.uuid}`
      : "/call/create";

    defaultData
      ? authorizedApi
          .post(apiUrl, submitData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            dispatch({
              type: defaultData ? UPDATE_CALL_SUCCESS : ADD_CALL_SUCCESS,
              payload: res.data.data.data,
            });
            notifications.show({
              message: "Call updated successfully!",
              color: "blue",
            });

            setFormData({
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
            closeAddEditCall();
          })
          .catch((err) => {
            notifications.show({
              message: err.response?.data?.message ?? "Failed to submit call!",
              color: "red",
            });
          })
          .finally(() => {
            setLoading(false);
          })
      : authorizedApi
          .post(apiUrl, submitData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            getCalls(dispatch);
            notifications.show({
              message: defaultData
                ? "Call updated successfully!"
                : "Call created successfully!",
              color: "blue",
            });
            setFormData({
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
            closeAddEditCall();
          })
          .catch((err) => {
            notifications.show({
              message: err.response?.data?.message ?? "Failed to submit call!",
              color: "red",
            });
          })
          .finally(() => {
            setLoading(false);
          });
  };

  return (
    <Modal
      size={""}
      opened={isOpenAddEditCall}
      onClose={closeAddEditCall}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-full md:w-[70vw]  lg:w-[50vw] max-h-[90vh] overflow-y-auto  relative bg-white rounded-3xl pt-10 pb-10 flex flex-col items-center modal">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeAddEditCall}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center ">
          <h1 className="text-2xl font-extrabold">Create Call</h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            Provide your call details to create a new call.
          </h2>
        </div>
        <div className="w-full flex flex-col items-center mt-4  px-[5%]">
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
                    {}
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
                    <textarea
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
                              {formData?.attachment instanceof File
                                ? formData.attachment.name
                                : formData?.attachment}
                            </p>
                          </div>
                        </>
                      )}
                    </label>
                    <input
                      id="attachment"
                      type="file"
                      name="attachment"
                      accept=".pdf, .doc, .docx"
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
                <div className="w-full flex space-x-4 justify-center">
                  <div className="">
                    <label
                      htmlFor="startDate"
                      className="block text-xs font-bold text-gray-700"
                    >
                      Start Date
                    </label>
                    <div className="w-full relative ">
                      <DatePicker
                        minDate={new Date()}
                        value={
                          formData.startDate
                            ? new Date(formData.startDate)
                            : null
                        }
                        onChange={(date: Date | null) => {
                          const formattedDate = date
                            ? dayjs(date).format("YYYY-MM-DD")
                            : "";
                          setFormData((prev) => ({
                            ...prev,
                            startDate: formattedDate,
                          }));
                        }}
                      />
                    </div>
                  </div>
                  <div className="">
                    <label
                      htmlFor="endDate"
                      className="block text-xs font-bold text-gray-700"
                    >
                      End Date
                    </label>
                    <div className="w-full relative">
                      <DatePicker
                        minDate={
                          formData.startDate
                            ? new Date(formData.startDate)
                            : undefined
                        }
                        value={
                          formData.endDate ? new Date(formData.endDate) : null
                        }
                        onChange={(date: Date | null) => {
                          const formattedDate = date
                            ? dayjs(date).format("YYYY-MM-DD")
                            : "";
                          setFormData((prev) => ({
                            ...prev,
                            endDate: formattedDate,
                          }));
                        }}
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
                        setSelectedSectors([]);
                      }}
                      data={MultiWindowData || []}
                      value={selectedWindows}
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
                        setSelectedSectors([]);
                      }}
                      data={MultiSubWindowData || []}
                      value={selectedSubWindows}
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
                      onChange={setSelectedSectors}
                      data={MultiSectorData || []}
                      value={selectedSectors}
                      placeholder="Select or type in a sector"
                      required
                    />
                  </div>
                </div>
                <div className="">
                  <label
                    htmlFor="windows"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Select Questions
                  </label>
                  <div className="mt-1 pl-6 relative block w-full bg-[#000F230A] py-1 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <span className="absolute left-2 top-3 text-black text-lg">
                      <SolarSuitcaseLinear />
                    </span>
                    <Select
                      name="questions"
                      onChange={(value) => {
                        setSelectedForm(value);
                      }}
                      data={FormsData || []}
                      value={selectedForm}
                      placeholder="Select or type in a given form of questions"
                      required
                    />
                  </div>
                </div>
                <div className="w-full flex justify-center mt-4 space-x-4 pb-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {loading
                      ? "Loading..."
                      : defaultData
                        ? "Update Call"
                        : "Create Call"}{" "}
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

export default AddEditCall;
