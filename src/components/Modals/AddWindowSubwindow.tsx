import { Modal, MultiSelect, Select, Stepper } from "@mantine/core";
import { FormEvent, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Folder2, Subtitles } from "solar-icon-set";
import {
  SolarAddSquareBold,
  SolarSuitcaseLinear,
  SolarUploadBold,
  SolarWindowFrameLinear,
} from "../core/icons";
import { CalendarMinimalistic } from "solar-icon-set";
import { ShieldWarning } from "solar-icon-set";
import { useDispatch, useSelector } from "react-redux";
import { notifications } from "@mantine/notifications";
import { useParams, useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import AddSector from "./AddSector";
import { authorizedApi } from "@/utils/api";

const AddWindowSubwindow = ({
  isOpenAddWindowSubwindow,
  closeAddWindowSubwindow,
  setSubWindows,
}: {
  isOpenAddWindowSubwindow: boolean;
  closeAddWindowSubwindow: () => void;
  setSubWindows: (p: any) => void;
}) => {
  const { id: windowId } = useParams();
  const dispatch = useDispatch();
  const [active, setActive] = useState(0);
  const [isAddSector, { open, close }] = useDisclosure(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sectors: [],
  });
  const [selectedSelectors, setSelectedSelectors] = useState<any>([]);
  const router = useRouter();
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));



  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  function handleSubmit() {
    console.log("Form Data: ", formData);
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
        setSubWindows((prevState: any) => [...prevState, res.data.data.data]);
        setFormData({
          title: "",
          description: "",
          sectors: [],
        });
        router.refresh();
        closeAddWindowSubwindow();
      })
      .catch((err) => {
        notifications.show({
          message:
            err.response?.data?.message ?? "Failed to create sub window!",
          color: "red",
        });
      });
  }
  const sectors = useSelector((state: any) => state.sectors);
  const MultiSelectData = sectors?.sectors?.map((sector: any) => {
    return { value: sector.uuid, label: sector.name };
  });

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
          onClick={closeAddWindowSubwindow}
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
                        // value={formData.title}
                        placeholder="Title"
                        onChange={handleChange}
                        className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                        required
                      />
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
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      placeholder="Add description"
                      onChange={handleChange}
                      className="mt-1 block w-full pb-28 pt-2 pl-8 px-3  bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="w-full flex justify-center mt-4 space-x-4">
                  <button
                    type="button"
                    onClick={closeAddWindowSubwindow}
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
                        MultiSelectData
                          ? MultiSelectData
                          : [
                              {
                                value: "NO SECTOR",
                                label: "No Sectors Created!",
                              },
                            ]
                      }
                      placeholder="Select or type in a sector"
                      required
                    />
                  </div>
                </div>
                {!MultiSelectData && (
                  <button
                    type="button"
                    onClick={open}
                    className="bg-[#005DE9] text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
                  >
                    <span className="text-2xl">
                      <SolarAddSquareBold />
                    </span>
                    <h1 className="text-base font-medium text-white">
                      Add Sectors
                    </h1>
                  </button>
                )}
                <div className="w-full flex justify-center mt-4 space-x-4">
                  <button
                    type="button"
                    onClick={closeAddWindowSubwindow}
                    className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </div>
            </Stepper.Step>
          </Stepper>
        </div>
      </div>
      <AddSector isOpenAddSector={isAddSector} closeAddSector={close} />
    </Modal>
  );
};

export default AddWindowSubwindow;
