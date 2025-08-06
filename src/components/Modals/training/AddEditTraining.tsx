import { Modal, MultiSelect, Popover, Select, Stepper } from "@mantine/core";
import { FormEvent, useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import axios from "axios";import { Training } from "@/types";
import { DatePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { Folder2 } from "solar-icon-set";
import { SolarUploadBold } from "@/components/core/icons";

const AddEditTraining = ({
  isOpenAddEditTraining,
  closeAddEditTraining,
  defaultData,
}: {
  isOpenAddEditTraining: boolean;
  closeAddEditTraining: () => void;
  defaultData?: Training;
}) => {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
   const [startOpened, setStartOpened] = useState(false);
   const [endOpened, setEndOpened] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const startRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
 const [formData, setFormData] = useState<Partial<Training>>({
   title: "",
   startDate: "",
   endDate: "",
   materialFile: null,
   traineesFile: null,
 });


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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (startRef.current && !startRef.current.contains(e.target as Node)) {
        setShowStartPicker(false);
      }
      if (endRef.current && !endRef.current.contains(e.target as Node)) {
        setShowEndPicker(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const formatDisplay = (dateStr?: string) =>
    dateStr ? dayjs(dateStr).format("YYYY-MM-DD") : "";

const handleSubmit = async()=>{
// submit logic
}

  return (
    <Modal
      size={""}
      opened={isOpenAddEditTraining}
      onClose={closeAddEditTraining}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-full md:w-[70vw] p-3 lg:w-[50vw] max-h-[90vh] overflow-y-auto  relative bg-white rounded-3xl pt-10 pb-10 flex flex-col items-center modal">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeAddEditTraining}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center ">
          <h1 className="text-2xl font-extrabold">
            {defaultData ? "Update Training" : "Create Training"}
          </h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            Provide your Training details to{" "}
            {defaultData ? "update " : "create a new "} Training.
          </h2>
        </div>
        <div className="w-full flex flex-col items-center mt-4  px-[5%]">
          <Stepper active={active} onStepClick={setActive} className="w-full">
            {/* Step 1 - Training Details */}
            <Stepper.Step label="Training Details">
              <div className="flex flex-col gap-4">
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

                <div>
                  <label className="text-xs font-semibold">
                    Select Training
                  </label>
                  <Select
                    placeholder="Select training"
                    data={[
                      { value: "web", label: "Web Development" },
                      { value: "ml", label: "Machine Learning" },
                    ]}
                    className="bg-[#000F230A] rounded-2xl"
                  />
                </div>

                <div className="flex gap-4">
                  {/* START DATE */}
                  <div className="flex-1">
                    <label className="text-xs font-semibold">Start Date</label>
                    <Popover
                      opened={startOpened}
                      onChange={setStartOpened}
                      position="bottom-start"
                      withArrow
                      shadow="md"
                    >
                      <Popover.Target>
                        <input
                          type="text"
                          readOnly
                          value={formatDisplay(formData.startDate)}
                          placeholder="Select start date"
                          onClick={() => {
                            setStartOpened((o) => !o);
                            setEndOpened(false);
                          }}
                          className="mt-1 w-full pl-3 py-2 bg-[#000F230A] rounded-2xl cursor-pointer"
                        />
                      </Popover.Target>
                      <Popover.Dropdown>
                        <DatePicker
                          value={
                            formData.startDate
                              ? new Date(formData.startDate)
                              : null
                          }
                          onChange={(date) => {
                            const formatted = date
                              ? dayjs(date).format("YYYY-MM-DD")
                              : "";
                            setFormData((prev: any) => ({
                              ...prev,
                              startDate: formatted,
                            }));
                            setStartOpened(false);
                          }}
                          minDate={new Date()}
                        />
                      </Popover.Dropdown>
                    </Popover>
                  </div>

                  {/* END DATE */}
                  <div className="flex-1">
                    <label className="text-xs font-semibold">End Date</label>
                    <Popover
                      opened={endOpened}
                      onChange={setEndOpened}
                      position="bottom-start"
                      withArrow
                      shadow="md"
                    >
                      <Popover.Target>
                        <input
                          type="text"
                          readOnly
                          value={formatDisplay(formData.endDate)}
                          placeholder="Select end date"
                          onClick={() => {
                            setEndOpened((o) => !o);
                            setStartOpened(false);
                          }}
                          className="mt-1 w-full pl-3 py-2 bg-[#000F230A] rounded-2xl cursor-pointer"
                        />
                      </Popover.Target>
                      <Popover.Dropdown>
                        <DatePicker
                          value={
                            formData.endDate ? new Date(formData.endDate) : null
                          }
                          onChange={(date) => {
                            const formatted = date
                              ? dayjs(date).format("YYYY-MM-DD")
                              : "";
                            setFormData((prev: any) => ({
                              ...prev,
                              endDate: formatted,
                            }));
                            setEndOpened(false);
                          }}
                          minDate={
                            formData.startDate
                              ? new Date(formData.startDate)
                              : undefined
                          }
                        />
                      </Popover.Dropdown>
                    </Popover>
                  </div>
                </div>

                <div className="flex justify-between gap-4 mt-4">
                  <button
                    onClick={closeAddEditTraining}
                    className="w-full px-4 py-2 bg-primaryText text-white rounded-full shadow-sm outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={nextStep}
                    className="w-full px-4 py-2 bg-primary text-white rounded-full shadow-sm outline-none"
                  >
                    Next
                  </button>
                </div>
              </div>
            </Stepper.Step>

            {/* Step 2 - Training Material Upload */}
            <Stepper.Step label="Training Material Upload">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <label className="text-xs font-semibold">
                    Training Manual
                  </label>
                  <button className="bg-blue-600 text-white py-2 px-4 rounded-full">
                    Download Template
                  </button>
                </div>

                <div className="w-full border-dashed border-2 border-blue-500 rounded-2xl h-36 flex items-center justify-center bg-[#000F230A]">
                  <label className="cursor-pointer items-center justify-center text-center place-items-center">
                    <SolarUploadBold className="text-blue-500 text-3xl items-center" />
                    <p className="text-sm">Upload File</p>
                    <p className="text-xs text-gray-400">
                      Drag & drop or click
                    </p>
                    <input
                      type="file"
                      name="material"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          materialFile: e.target.files?.[0] || null,
                        }))
                      }
                      hidden
                    />
                  </label>
                </div>

                <div>
                  <label className="text-xs font-semibold">
                    Related Application
                  </label>
                  <Select
                    placeholder="Select related application"
                    data={[
                      { value: "applicationA", label: "Application A" },
                      { value: "applicationB", label: "Application B" },
                    ]}
                    className="bg-[#000F230A] rounded-2xl"
                  />
                </div>

                <div className="flex justify-between gap-4 mt-4">
                  <button
                    onClick={prevStep}
                    className="w-full px-4 py-2 bg-primaryText text-white rounded-full shadow-sm outline-none"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="w-full px-4 py-2 bg-primary text-white rounded-full shadow-sm outline-none"
                  >
                    Next
                  </button>
                </div>
              </div>
            </Stepper.Step>

            {/* Step 3 - Trainees Details */}
            <Stepper.Step label="Trainees Details">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <label className="text-xs font-semibold">
                    Trainees Template
                  </label>
                  <button className="bg-blue-600 text-white py-2 px-4 rounded-full">
                    Download Template
                  </button>
                </div>

                <div className="w-full border-dashed border-2 border-blue-500 rounded-2xl h-36 flex items-center justify-center bg-[#000F230A]">
                  <label className="cursor-pointer items-center justify-center text-center place-items-center">
                    <SolarUploadBold className="text-blue-500 text-3xl items-center" />
                    <p className="text-sm">Upload File</p>
                    <p className="text-xs text-gray-400">
                      Drag & drop or click
                    </p>
                    <input
                      type="file"
                      name="material"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          materialFile: e.target.files?.[0] || null,
                        }))
                      }
                      hidden
                    />
                  </label>
                </div>

                <div className="flex justify-between gap-4 mt-4">
                  <button
                    onClick={prevStep}
                    className="w-full px-4 py-2 bg-primaryText text-white rounded-full shadow-sm outline-none"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-primary  text-white rounded-full shadow-sm outline-none"
                  >
                    {loading ? "Saving..." : "Save"}
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

export default AddEditTraining;
