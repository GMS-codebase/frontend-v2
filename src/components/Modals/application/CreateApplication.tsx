import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { notifications } from "@mantine/notifications";
import { authorizedApi } from "@/utils/api";
import { Modal, MultiSelect, Select } from "@mantine/core";
import { Folder2, Subtitles } from "solar-icon-set";
import { IoMdClose } from "react-icons/io";
import { SolarSuitcaseLinear } from "@/components/core/icons";

const CreateApplication = ({
  isOpenCreatingApplication,
  closeCreatingApplication,
  finishCreatingApplication,
  call,
}: {
  isOpenCreatingApplication: boolean;
  closeCreatingApplication: () => void;
  finishCreatingApplication: () => void;
  call: any;
}) => {
  const trades = useSelector((state: any) => state.trades.trades);

  const [formData, setFormData] = useState({
    window: null,
    subwindow: null,
    description: "",
    sectors: [] as string[],
    trades: [] as string[],
  });

  const [errors, setErrors] = useState({
    window: "",
    subwindow: "",
    description: "",
    sectors: "",
    trades: "",
  });

  useEffect(() => {
    if (call?.windows) {
      setFormData((prevData) => ({
        ...prevData,
        window: call?.windows[0]?.uuid || null,
      }));
    }
  }, [call]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      window: "",
      subwindow: "",
      description: "",
      sectors: "",
      trades: "",
    };
    if (!formData.window) newErrors.window = "Please select a window.";
    if (!formData.subwindow) newErrors.subwindow = "Please select a subwindow.";
    if (!formData.description)
      newErrors.description = "Description is required.";
    if (!formData.sectors.length)
      newErrors.sectors = "Please select at least one sector.";
    if (!formData.trades.length)
      newErrors.trades = "Please select at least one trade.";

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }

    try {
      await authorizedApi.post(`/application/create-application/${call.uuid}`, {
        window: formData.window,
        subwindow: formData.subwindow,
        description: formData.description,
        sectors: formData.sectors,
        trades: formData.trades,
      });
      notifications.show({
        title: "Success",
        message: "Application created successfully!",
        color: "green",
      });
      finishCreatingApplication();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message || "Something went wrong.",
        color: "red",
      });
    }
  };

  const windowOptions =
    call?.windows.map((window: any) => ({
      label: window.title,
      value: window.uuid,
    })) || [];

  const subwindowOptions = formData.window
    ? call?.windows
        .find((window: any) => window.uuid === formData.window)
        ?.subWindows.map((sub: any) => ({
          label: sub.title,
          value: sub.uuid,
        })) || []
    : [];

  const sectorOptions = formData.subwindow
    ? call?.windows
        .find((window: any) => window.uuid === formData.window)
        ?.subWindows.find((sub: any) => sub.uuid === formData.subwindow)
        ?.sectors.map((sector: any) => ({
          label: sector.name,
          value: sector.uuid,
        })) || []
    : [];

  const tradeOptions = trades.map((trade: any) => ({
    label: trade.title,
    value: trade.uuid,
  }));
  return (
    <Modal
      size=""
      opened={isOpenCreatingApplication}
      onClose={closeCreatingApplication}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="max-w-[50vw] w-[50vw] max-h-[90vh] relative bg-white rounded-3xl p-4 pt-10 pb-10 flex flex-col items-center overflow-y-auto">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={closeCreatingApplication}
        >
          <IoMdClose size={25} color="#000" />
        </button>
        <p className="text-center font-bold text-2xl">Create Application</p>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white w-full p-6">
          <div className="w-full">
            <label
              htmlFor="window"
              className="block text-xs font-bold text-gray-700"
            >
              Window
            </label>
            <div className="w-full relative">
              <span className="absolute left-2 top-[10px]">
                <Folder2 />
              </span>
              <Select
                name="window"
                value={formData.window}
                onChange={(value) =>
                  setFormData(
                    (prevData) =>
                      ({
                        ...prevData,
                        window: value,
                        subwindow: null,
                        sectors: [],
                      }) as any,
                  )
                }
                data={windowOptions}
                className="mt-1 block w-full pl-5 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Select Window"
              />
            </div>
            {errors.window && (
              <p className="text-red-500 text-sm">{errors.window}</p>
            )}
          </div>
          <div className="w-full">
            <label
              htmlFor="subwindow"
              className="block text-xs font-bold text-gray-700"
            >
              Subwindow
            </label>
            <div className="w-full relative">
              <span className="absolute left-2 top-[10px]">
                <Folder2 />
              </span>
              <Select
                name="subwindow"
                value={formData.subwindow}
                onChange={(value) =>
                  setFormData(
                    (prevData) =>
                      ({
                        ...prevData,
                        subwindow: value,
                        sectors: [],
                      }) as any,
                  )
                }
                data={subwindowOptions}
                className="mt-1 block w-full pl-5 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Select Subwindow"
              />
            </div>
            {errors.subwindow && (
              <p className="text-red-500 text-sm">{errors.subwindow}</p>
            )}
          </div>
          <div className="">
            <label
              htmlFor="sectors"
              className="block text-xs font-bold text-gray-700"
            >
              Select Sectors
            </label>
            <div className="mt-1 pl-6 relative block w-full bg-[#000F230A] py-1 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <span className="absolute left-2 top-3 text-black text-lg">
                <SolarSuitcaseLinear />
              </span>
              <MultiSelect
                name="sectors"
                value={formData.sectors}
                onChange={(value) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    sectors: value,
                  }))
                }
                data={sectorOptions}
                placeholder="Select or type in a sector"
                required
              />
            </div>
            {errors.sectors && (
              <p className="text-red-500 text-sm">{errors.sectors}</p>
            )}
          </div>
          <div className="">
            <label
              htmlFor="trades"
              className="block text-xs font-bold text-gray-700"
            >
              Select Trades
            </label>
            <div className="mt-1 pl-6 relative block w-full bg-[#000F230A] py-1 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <span className="absolute left-2 top-3 text-black text-lg">
                <SolarSuitcaseLinear />
              </span>
              <MultiSelect
                name="trades"
                value={formData.trades}
                onChange={(value) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    trades: value,
                  }))
                }
                data={tradeOptions}
                placeholder="Select or type in a trade"
                required
              />
            </div>
            {errors.trades && (
              <p className="text-red-500 text-sm">{errors.trades}</p>
            )}
          </div>
          <div className="">
            <label
              htmlFor="description"
              className="block text-lg font-bold text-gray-700"
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
                className="mt-1 block w-full pb-5 pt-2 pl-8 pr-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                required
              />
            </div>
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
          <div className="w-full flex justify-center mt-4 space-x-4">
            <button
              type="button"
              onClick={closeCreatingApplication}
              className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Application
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateApplication;
