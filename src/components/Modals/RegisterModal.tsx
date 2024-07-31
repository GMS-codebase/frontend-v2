import { Modal, Select, Stepper } from "@mantine/core";
import Image from "next/image";
import { SetStateAction, useState } from "react";
import { IoMdClose, IoMdPerson } from "react-icons/io";
import SideVector1 from "@/assets/Vectors/sidevecto.svg";
import SideVector2 from "@/assets/Vectors/sidevector2.svg";
import { BsPerson } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { MdPhoneAndroid } from "react-icons/md";

const RegisterModal = ({
  isOpenRegister,
  closeRegister,
}: {
  isOpenRegister: boolean;
  closeRegister: () => void;
}) => {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    institutionName:"",
    position:""
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
    <Modal
      size={""}
      opened={isOpenRegister}
      onClose={closeRegister}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[550px] h-full relative bg-white rounded-3xl p-4 pt-10 pb-6 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeRegister}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <Image
          src={SideVector1}
          alt="vector"
          className="absolute top-[3rem] right-[-4rem]"
          width={100}
          height={50}
        />
        <Image
          src={SideVector2}
          alt="vector"
          className="absolute bottom-[3rem] left-[-4rem]"
          width={100}
          height={50}
        />
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">Register</h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            Provide your details to register your account.
          </h2>
        </div>

        <div className="w-4/5 flex flex-col items-center mt-4 overflow-hidden">
          <Stepper active={active} onStepClick={setActive} className="w-full">
            <Stepper.Step
              label="Contact Person"
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
                      First name
                    </label>
                    <div className="w-full relative">
                      <span className="absolute left-2 top-[10px]">
                        <BsPerson />
                      </span>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        placeholder="Type in your first name"
                        onChange={handleChange}
                        className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="lastName"
                      className="block text-xs font-bold text-gray-700"
                    >
                      Last Name
                    </label>
                    <div className="w-full relative">
                      <span className="absolute left-2 top-[10px]">
                        <BsPerson />
                      </span>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        placeholder="Type in your last name"
                        onChange={handleChange}
                        className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="">
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Email
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <HiOutlineMail />
                    </span>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      placeholder="Type in your email"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Phone Number
                  </label>
                  <div className="relative mt-1 rounded-full">
                    <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        <MdPhoneAndroid color="#000" size={21}/>
                      </span>
                    </div>
                    <div className="absolute inset-y-0 left-7 top-2 pl-3 flex items-center pointer-events-none py-1 h-3 bg-white">
                      <span className="text-gray-500 text-xs ">+250</span>
                    </div>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Type in your phone"
                      className="block w-full pl-20 pr-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label
                    htmlFor="gender"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Gender
                  </label>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={(value: any) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        gender: value,
                      }))
                    }
                    data={[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "other", label: "Other" },
                    ]}
                    placeholder="Select your gender"
                    required
                    className="mt-1 block w-full bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none sm:text-sm"
                  />
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
                  <span className="text-base font-medium text-[#005DE9]">
                    Login
                  </span>
                </h1>
              </form>
            </Stepper.Step>
            <Stepper.Step label="Applicant Info" description="" className="text-xs">
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
                      name="position"
                      value={formData.position}
                      onChange={(value: any) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          position: value,
                        }))
                      }
                      data={[
                        { value: "CEO", label: "CEO" },
                        { value: "CTO", label: "CTO" },
                        { value: "Marketing Manager", label: "Marketing Manager" },
                      ]}
                      placeholder="Select your position"
                      required
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col justify-center mt-4 gap-3">
                  <button
                    type="submit"
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
                  <span className="text-base font-medium text-[#005DE9]">
                    Login
                  </span>
                </h1>
              </form>
            </Stepper.Step>
          </Stepper>
        </div>
      </div>
    </Modal>
  );
};

export default RegisterModal;
