import { Modal, Select, Stepper } from "@mantine/core";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Folder2, Subtitles } from "solar-icon-set";
import { SolarUploadBold } from "../core/icons";
import { CalendarMinimalistic } from "solar-icon-set";
import {ShieldWarning} from "solar-icon-set";

const AddCall = ({
  isOpenAddCall,
  closeAddCall,
}: {
  isOpenAddCall: boolean;
  closeAddCall: () => void;
}) => {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const [formData, setFormData] = useState({
    callTitle: "",
    description: "",
    startDate: "",
    endDate: "",
    appealDays: "",
    institutionName: "",
    windows: "",
    sectors: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form Data: ", formData);
  };

  return (
    <>
      <Modal
        size={""}
        opened={isOpenAddCall}
        onClose={closeAddCall}
        closeOnClickOutside={false}
        withCloseButton={false}
      >
        <div className="w-[80vh] h-full relative bg-white rounded-3xl pt-10 pb-6 flex flex-col items-center">
          <button
            className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
            onClick={closeAddCall}
          >
            <IoMdClose size={25} color={"#000"} />
          </button>
          <div className="w-full flex flex-col items-center">
            <h1 className="text-2xl font-extrabold">Create Call</h1>
            <h2 className="text-[#000F2369] text-lg font-medium">
              Provide your call details to create a new call.
            </h2>
          </div>
          <div className="w-4/5 flex flex-col items-center mt-4 overflow-hidden">
            <Stepper active={active} onStepClick={setActive} className="w-full">
              <Stepper.Step
                label="Call detail"
                description=""
                className="text-xs"
              >
                <form
                  onSubmit={handleSubmit}
                  className="w-full h-[60vh] overflow-y-auto flex flex-col gap-2 px-2"
                >
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
                          name="callTitle"
                          value={formData.callTitle}
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
                      htmlFor="fileUpload"
                      className="block text-xs font-bold text-gray-700"
                    >
                      Attachment
                    </label>
                    <div className="relative mt-1 flex flex-col items-center justify-center w-full h-[15vh] border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
                      >
                        <SolarUploadBold className="text-blue-500 text-3xl" />
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Upload file</p>
                          <p className="text-xs text-gray-400">
                            or drag and drop
                          </p>
                        </div>
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleChange}
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
                      type="submit"
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Next
                    </button>
                  </div>
                </form>
              </Stepper.Step>

              <Stepper.Step
                label="Timeline Details"
                description=""
                className="text-xs"
              >
                <form
                  onSubmit={handleSubmit}
                  className="mt-4 w-full h-[70%] overflow-y-auto flex flex-col gap-2 px-2"
                >
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
                      htmlFor="appealdays"
                      className="block text-xs font-bold text-gray-700"
                    >
                   Appeal Days
                    </label>
                    <div className="mt-1 pl-4 relative block w-full bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <span className="absolute left-2 top-[10px]">
                        <ShieldWarning/>
                      </span>
                    <h1 className="py-2 px-4">5 days</h1>
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
                      type="submit"
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Next
                    </button>
                  </div>
                </form>
              </Stepper.Step>

              <Stepper.Step
                label="Applicant Info"
                description=""
                className="text-xs"
              >
                <form
                  onSubmit={handleSubmit}
                  className="mt-4 w-full h-[70%] overflow-y-auto flex flex-col gap-2 px-2"
                >
            
                  <div className="w-full">
                    <label
                      htmlFor="windows"
                      className="block text-xs font-bold text-gray-700"
                    >
                     Windows
                    </label>
                    <div className="mt-1 pl-4 relative block w-full bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <span className="absolute left-2 top-[10px]">
                        
                      </span>
                      <Select
                        name="windows"
                        value={formData.windows}
                        onChange={(value: any) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            position: value,
                          }))
                        }
                        data={[
                          { value: "rapid", label: "Rapid response training" },
                          { value: "new", label: "Rapid response training" },
                          { value: "rapid2", label: "Rapid response training" },
                          
                          {
                            value: "Marketing Manager",
                            label: "Marketing Manager",
                          },
                        ]}
                        placeholder="Select or type the window"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="sectors"
                      className="block text-xs font-bold text-gray-700"
                    >
                     Sectors
                    </label>
                    <div className="mt-1 pl-4 relative block w-full bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <span className="absolute left-2 top-[10px]">
                        
                      </span>
                      <Select
                        name="sectors"
                        value={formData.windows}
                        onChange={(value: any) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            position: value,
                          }))
                        }
                        data={[
                          { value: "CEO", label: "CEO" },
                          { value: "CTO", label: "CTO" },
                          {
                            value: "Marketing Manager",
                            label: "Marketing Manager",
                          },
                        ]}
                        placeholder="Select your position"
                        required
                      />
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
                      type="submit"
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Next
                    </button>
                  </div>
                  </div>

                </form>
              </Stepper.Step>
            </Stepper>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddCall;

