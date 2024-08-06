"use client"
import { useState } from "react";
import * as Icons from "@/components/core/icons";
import { SolarUploadBold } from "@/components/core/icons";
import { Select } from "@mantine/core";
import Image from "next/image";
import { BsPerson } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { MdPhoneAndroid } from "react-icons/md";
import { Upload } from "solar-icon-set";
const Page = () => {
  const [activeSection, setActiveSection] = useState("contact");

  return (
    <div className="w-full">
      <div className="w-full h-[180px] bg-[#000F23] rounded-md"></div>
      <button className="absolute top-64 mt-3 bg-white left-[30rem] text-3xl text-primary p-4 rounded-full">
        <Icons.SolarUserBold className="w-[100px] h-[100px]" />
      </button>
      <div className="ml-64 mt-3">
        <h1 className="text-2xl">ISHEMA HUGUES</h1>
        <h1 className="font-bold text-primary">Admin</h1>
      </div>
      <div className="w-full flex gap-4">
        <div className="w-[50%]">
          <div className="flex gap-2 mb-10 mt-5">
            <button
              className={`w-full text-center justify-center border-b-2  py-3 px-7 flex flex-row items-center gap-3 ${
                activeSection === "contact" ? "bg-[#005DE9] border-b-[#005DE9] text-[#005DE9] bg-opacity-50" : "bg-[#005DE9] bg-opacity-50"
              }`}
              onClick={() => setActiveSection("contact")}
            >
              <h1 className="text-base font-medium text-white">Contact Person</h1>
            </button>
            <button
              className={`w-full text-center justify-center border-b-2  py-3 px-7 flex flex-row items-center gap-3 ${
                activeSection === "employment" ? "bg-[#005DE9] border-b-[#005DE9] text-[#005DE9] bg-opacity-50" : "bg-[#005DE9] bg-opacity-50"
              }`}
              onClick={() => setActiveSection("employment")}
            >
              <h1 className="text-base font-medium text-white">Employment details</h1>
            </button>
          </div>
          {activeSection === "contact" ? (
            <div>
              <div className="w-full flex justify-between gap-3">
                <div className="w-full">
                  <label htmlFor="firstName" className="block text-xs font-bold text-gray-700">
                    First name
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <BsPerson />
                    </span>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Hugues"
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label htmlFor="lastName" className="block text-xs font-bold text-gray-700">
                    Last Name
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <BsPerson />
                    </span>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Ishema"
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="w-full">
                <label htmlFor="email" className="block text-xs font-bold text-gray-700">
                  Email
                </label>
                <div className="w-full relative">
                  <span className="absolute left-2 top-[10px]">
                    <HiOutlineMail />
                  </span>
                  <input
                    type="text"
                    name="email"
                    placeholder="huguesishema@gmail.com"
                    className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="w-full">
                <label htmlFor="phoneNumber" className="block text-xs font-bold text-gray-700">
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
                    placeholder="789 175 211"
                    className="block w-full pl-[6.5rem] pr-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="w-full">
                <label htmlFor="gender" className="block text-xs font-bold text-gray-700">
                  Gender
                </label>
                <Select
                  name="gender"
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
            </div>
          ) : (
            <div>
              {/* Employment details form fields go here */}
              <div className="w-full">
                <label htmlFor="position" className="block text-xs font-bold text-gray-700">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  placeholder="Type in your position"
                  className="mt-1 block w-full px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="w-full mt-4">
                <label htmlFor="department" className="block text-xs font-bold text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  placeholder="Type in your department"
                  className="mt-1 block w-full px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>
          )}

          <div className="w-full gap-2 flex justify-center mt-4">
            <button type="submit" className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Cancel
            </button>
            <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Save
            </button>
          </div>
        </div>
        <div className="w-[50%]">
          <label htmlFor="fileUpload" className="block text-xs font-bold text-gray-700">
            Attachment
          </label>
          <div className="relative mt-1 flex flex-col items-center justify-center w-full h-[90%] border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <label htmlFor="file-upload" className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
              <Icons.MingcuteUpload3Fill className="text-blue-500 text-5xl bg-[#005DE9] bg-opacity-50 rounded-full p-2" />
              <div className="text-center">
                <p className="text-lg text-gray-500">Upload file</p>
                <p className="text-lg text-gray-400">or drag and drop</p>
              </div>
            </label>
            <input id="file-upload" type="file" style={{ display: "none" }} className="content-none" required />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

