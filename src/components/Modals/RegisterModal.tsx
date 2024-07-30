import { Modal, Select } from "@mantine/core";
import Image from "next/image";
import { SetStateAction, useState } from "react";
import { IoMdClose, IoMdPerson } from "react-icons/io";
import SideVector1 from "@/assets/Vectors/sidevecto.svg";
import SideVector2 from "@/assets/Vectors/sidevector2.svg";
import { BsPerson } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";

const RegisterModal = ({
  isOpenRegister,
  closeRegister,
}: {
  isOpenRegister: boolean;
  closeRegister: () => void;
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
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
      size={"lg"}
      opened={isOpenRegister}
      onClose={closeRegister}
      closeOnClickOutside={false}
      withCloseButton={false}
      className="rounded-3xl"
    >
      <div className="w-full h-full relative bg-white rounded-3xl p-4 pt-10 overflow-hidden pb-6">
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

        {/* <div className="w-full flex flex-col items-center"> */}
        

          <form onSubmit={handleSubmit} className="mt-4 w-4/5 flex flex-col gap-2">
            <div className="w-full flex justify-between gap-3">

              <div className="w-full">
                <label
                  htmlFor="lastName"
                  className="block text-xs font-bold text-gray-700"
                >
                  First name
                </label>
                <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]"><BsPerson/></span>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  placeholder="Type in your first name"
                  onChange={handleChange}
                  className="mt-1 block w-full pl-8 px-3 py-2  bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                    <span className="absolute left-2 top-[10px]"><BsPerson/></span>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  placeholder="Type in your last name"
                  onChange={handleChange}
                  className="mt-1 block w-full pl-8 px-3 py-2  bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                    <span className="absolute left-2 top-[10px]"><HiOutlineMail/></span>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  placeholder="Type in your email"
                  onChange={handleChange}
                  className="mt-1 block w-full pl-8 px-3 py-2  bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">+250</span>
                </div>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Type in your phone"
                  className="block w-full pl-10 sm:pl-20 pr-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  setFormData((prevData) => ({ ...prevData, gender: value }))
                }
                data={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                placeholder="Select your gender"
                required
                className="mt-1 block w-full bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="w-full flex justify-center mt-4">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Next
              </button>
            </div>
            <h1 className="text-[#000F2369] text-base font-medium mt-4">Already have an account? <span className="text-base font-medium text-[#005DE9]">Login</span></h1>
          </form>
        {/* </div> */}
      </div>
    </Modal>
  );
};

export default RegisterModal;
