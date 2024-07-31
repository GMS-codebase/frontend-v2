import { Modal, Select, Stepper } from "@mantine/core";
import Image from "next/image";
import { SetStateAction, useState } from "react";
import { IoMdClose, IoMdPerson } from "react-icons/io";
import { BsPerson } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { MdPhoneAndroid } from "react-icons/md";
import {Folder2} from "solar-icon-set"
import {Subtitles} from 'solar-icon-set'



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
    institutionName:"",
    windows:"",
    sectors:""
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
      <div className="w-[700px] h-full relative bg-white rounded-3xl p-4 pt-10 pb-6 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeAddCall}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">Create Call</h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
          Provide your the call details to create a new call.
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
                      htmlFor="firstName"
                      className="block text-xs font-bold text-gray-700"
                    >
                 Title
                    </label>
                    <div className="w-full relative">
                      <span className="absolute left-2 top-[10px]">
                        <Folder2/>
                      </span>
                      <input
                        type="text"
                        name="firstName"
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
                    htmlFor="description"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Attachment
                  </label>
                  <div className="w-full relative">

                    <input
                      type="file"
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 block w-full h-[15vh] border-blue-500 border-dashed border-2 pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="w-full flex justify-center mt-4">
                  <button
                    onClick={nextStep}
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Next
                  </button>
                </div>
                <h1 className="w-full text-center text-[#000F2369] text-base font-medium mt-4">
                  Already have an account?{" "}
                  <span className="text-base font-medium cursor-pointer text-[#005DE9]">
                    Login
                  </span>
                </h1>
              </form>
            </Stepper.Step>
            <Stepper.Step label="Timeline Details" description="" className="text-xs">
              <form
                onSubmit={handleSubmit}
                className="mt-4 w-full h-[70%] overflow-y-auto flex flex-col gap-2 px-2"
              >
                <div className="w-full">
                  <label
                    htmlFor="institutionName"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Institution Name
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <HiOutlineMail />
                    </span>
                    <input
                      type="text"
                      name="institutionName"
                      value={formData.institutionName}
                      placeholder="Type in institution name"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label
                    htmlFor="position"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Position
                  </label>
                  <div className="mt-1 pl-4 relative block w-full bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <span className="absolute left-2 top-[10px]">
                      <HiOutlineMail />
                    </span>
                    <Select
                      name="startDate"
                      value={formData.startDate}
                      onChange={(value: any) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          position: value,
                        }))
                      }
                      placeholder="Select your position"
                      required
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col justify-center mt-4 gap-3">
                  <button
                    type="submit"
                    // onClick={handleOpenSuccess}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full px-4 py-2 bg-[#005DE916] text-blue-700 font-bold rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    Go Back
                  </button>
                </div>
                <h1 className="text-[#000F2369] text-base font-medium mt-4">
                  Already have an account?{" "}
                  <span className="text-base font-medium text-[#005DE9] cursor-pointer">
                    Login
                  </span>
                </h1>
              </form>
            </Stepper.Step>

            <Stepper.Step label="Category details" description="" className="text-xs">
              <form
                onSubmit={handleSubmit}
                className="mt-4 w-full h-[70%] overflow-y-auto flex flex-col gap-2 px-2"
              >
                <div className="w-full">
                  <label
                    htmlFor="institutionName"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Institution Name
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <HiOutlineMail />
                    </span>
                    <input
                      type="text"
                      name="institutionName"
                      value={formData.institutionName}
                      placeholder="Type in institution name"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label
                    htmlFor="position"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Position
                  </label>
                  <div className="mt-1 pl-4 relative block w-full bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <span className="absolute left-2 top-[10px]">
                      <HiOutlineMail />
                    </span>
                    <Select
                      name="startDate"
                      value={formData.startDate}
                      onChange={(value: any) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          position: value,
                        }))
                      }
                      placeholder="Select your position"
                      required
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col justify-center mt-4 gap-3">
                  <button
                    type="submit"
                    // onClick={handleOpenSuccess}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-full px-4 py-2 bg-[#005DE916] text-blue-700 font-bold rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    Go Back
                  </button>
                </div>
                <h1 className="text-[#000F2369] text-base font-medium mt-4">
                  Already have an account?{" "}
                  <span className="text-base font-medium text-[#005DE9] cursor-pointer">
                    Login
                  </span>
                </h1>
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
