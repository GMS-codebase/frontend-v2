import { Checkbox, Modal, Select, Stepper } from "@mantine/core";
import Image from "next/image";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import SideVector1 from "@/assets/Vectors/sidevecto.svg";
import SideVector2 from "@/assets/Vectors/sidevector2.svg";
import { BsPerson } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { MdPhoneAndroid } from "react-icons/md";
import { PhGenderIntersex, SolarSuitcaseLinear } from "../core/icons";
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  position: string;
  isInternal: undefined | boolean;
};
const UpdateEmployee = ({
  isOpenUpdateEmployee,
  closeUpdateEmployee,
}: {
  isOpenUpdateEmployee: boolean;
  closeUpdateEmployee: () => void;
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    position: "",
    isInternal: undefined,
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
  };

  const [selectedInfo, setSelectedInfo] = useState("contact");
  return (
    <Modal
      size={""}
      opened={isOpenUpdateEmployee}
      onClose={closeUpdateEmployee}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[550px] h-fit relative bg-white rounded-3xl p-4 pt-10 pb-4 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeUpdateEmployee}
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
          <h1 className="text-2xl font-extrabold">Update employee</h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            Provide new employee details to update the employee.
          </h2>
        </div>

        <div className="w-4/5 flex flex-col items-center mt-4 overflow-hidden">
          <div className="w-full flex items-center">
            <div
              onClick={() => setSelectedInfo("contact")}
              className={`w-1/2 flex justify-end rounded-l-full ${selectedInfo === "contact" ? "bg-[#005DE90A]" : ""}`}
            >
              <button
                className={`py-4 text-base w-[90%] font-medium ${selectedInfo === "contact" ? "border-b-2 border-[#005DE9] text-[#005DE9]" : ""}`}
              >
                Contact Person
              </button>
            </div>
            <div
              onClick={() => setSelectedInfo("employment")}
              className={`w-1/2 flex justify-start rounded-r-full ${selectedInfo === "employment" ? "bg-[#005DE90A]" : ""}`}
            >
              <button
                className={`py-4 text-base w-[90%]  font-medium ${selectedInfo === "employment" ? "border-b-2 border-[#005DE9] text-[#005DE9]" : ""}`}
              >
                Employment Details
              </button>
            </div>
          </div>
          {selectedInfo === "contact" && (
            <form
              onSubmit={handleSubmit}
              className="w-full overflow-y-auto flex flex-col gap-2 px-2 mt-4"
            >
              <div className="w-full flex justify-between gap-3">
                <div className="w-full">
                  <label
                    htmlFor="firstName"
                    className="block text-base font-medium text-black"
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
                    className="block text-base font-medium text-black"
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
                  className="block text-base font-medium text-black"
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
                  className="block text-base font-medium text-black"
                >
                  Phone Number
                </label>
                <div className="relative mt-1 rounded-full">
                  <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">
                      <MdPhoneAndroid color="#000" size={21} />
                    </span>
                  </div>
                  <div className="absolute left-7 top-1 pl-1 py-1 flex items-center pointer-events-none pr-2 rounded-md bg-white">
                    <span className="text-gray-500 text-sm ml-2">+250</span>
                  </div>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Type in your phone"
                    className="block w-full pl-[6.5rem] pr-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="w-full">
                <label
                  htmlFor="gender"
                  className="block text-base font-medium text-black"
                >
                  Gender
                </label>
                <div className="mt-1 pl-4 relative block w-full bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <span className="absolute left-2 top-2 text-lg">
                    <PhGenderIntersex />
                  </span>
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
                  />
                </div>
              </div>

              <div className="w-full flex justify-center mt-4 space-x-4">
                <button
                  type="button"
                  onClick={closeUpdateEmployee}
                  className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </form>
          )}
          {selectedInfo === "employment" && (
            <form
              onSubmit={handleSubmit}
              className="mt-4 w-full h-[70%] overflow-y-auto flex flex-col gap-2 px-2"
            >
              <div className="w-full">
                <label
                  htmlFor="position"
                  className="block text-base font-medium text-black"
                >
                  Position
                </label>
                <div className="mt-1 pl-4 relative block w-full bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <span className="absolute left-2 top-[10px]">
                    <SolarSuitcaseLinear />
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
                      {
                        value: "Marketing Manager",
                        label: "Marketing Manager",
                      },
                    ]}
                    placeholder="Select your position"
                    required
                  />
                </div>
              </div>
              <div className="w-full">
                <label
                  htmlFor="position"
                  className="block text-base font-medium text-black"
                >
                  Is Internal
                </label>
                <div className="mt-1 pl-1 flex flex-col gap-2">
                  <Checkbox
                    label="Yes"
                    checked={formData.isInternal}
                    onChange={(e: any) =>
                      setFormData({ ...formData, isInternal: true })
                    }
                  />
                  <Checkbox
                    label="No"
                    checked={formData.isInternal == false}
                    onChange={(e: any) =>
                      setFormData({ ...formData, isInternal: false })
                    }
                  />
                </div>
              </div>

              <div className="w-full flex justify-center mt-4 space-x-4">
                <button
                  type="button"
                  onClick={closeUpdateEmployee}
                  className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={closeUpdateEmployee}
                  type="button"
                  className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UpdateEmployee;
