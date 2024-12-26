"use client";
import { useEffect, useState } from "react";
import * as Icons from "@/components/core/icons";
import { SolarUploadBold } from "@/components/core/icons";
import { Select, Skeleton } from "@mantine/core";
import Image from "next/image";
import { BsPerson } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { MdPhoneAndroid } from "react-icons/md";
import { Upload } from "solar-icon-set";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { LOGOUT } from "@/actions/AuthActions";
import { GET_PROFILE_ERROR } from "@/actions/ProfileActions";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { notifications } from "@mantine/notifications";
const Profile = () => {
  const profile = useSelector((state: any) => state.profile);
  const [activeSection, setActiveSection] = useState("contact");
  const [formData, setFormData] = useState({
    firstName: profile?.profile?.firstname,
    lastName: profile?.profile?.lastname,
    email: profile?.profile?.email,
    phoneNumber: profile?.profile?.phoneNumber,
    gender: profile?.profile?.gender,
    position: profile?.profile?.position,
    institution: profile?.profile?.institution,
  });
  useEffect(() => {
    console.log(profile.profile);
    setFormData({
      firstName: profile?.profile?.firstname,
      lastName: profile?.profile?.lastname,
      email: profile?.profile?.email,
      phoneNumber: profile?.profile?.phone,
      gender: profile?.profile?.gender,
      position: profile?.profile?.position,
      institution: profile?.profile?.institution,
    });
  }, [profile]);
  const dispatch = useDispatch();
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full bg-white rounded-2xl ">
      {profile?.loading ? (
        <div className="w-full h-[105vh] p-5">
          <Skeleton height={180} radius="xl" className="mb-4" />
          <div className="w-full mt-20 flex gap-4">
            <div className="w-[60%]">
              <Skeleton height={50} radius="xl" className="mb-5" />
              <Skeleton height={30} radius="xl" className="mb-2" />
              <Skeleton height={30} radius="xl" className="mb-2" />
              <Skeleton height={30} radius="xl" className="mb-2" />
              <Skeleton height={50} radius="xl" className="mt-4" />
            </div>
            <div className="w-[50%] px-5">
              <Skeleton height="100%" radius="xl" />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full h-[180px] bg-[#000F23] rounded-t-2xl relative mb-20">
            <div className="absolute top-[60%] left-[4%]">
              <div className="flex items-end gap-3">
                <button className=" mt-3 bg-white  text-3xl text-primary p-4 rounded-full">
                  <Icons.SolarUserBold className="w-[100px] h-[100px]" />
                </button>
                <div className="">
                  <h1 className="text-2xl">{profile?.profile?.firstname}</h1>
                  <h1 className="font-bold text-primary">
                    {profile?.profile?.role}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex gap-4 justify-center  p-5">
            <div className="lg:w-[60%]">
              <div className="flex  mb-10 mt-5">
                <button
                  className={`w-full text-center justify-center border-b-2  py-3 px-7 flex flex-row items-center gap-3 rounded-l-2xl ${
                    activeSection === "contact"
                      ? "bg-[#005DE90A] border-b-[#005DE9] text-[#005DE9]"
                      : "bg-[#000F2303]  text-black"
                  }`}
                  onClick={() => setActiveSection("contact")}
                >
                  <h1 className="text-base font-medium ">Contact Person</h1>
                </button>
                <button
                  className={`w-full text-center justify-center border-b-2  py-3 px-7 flex flex-row items-center gap-3 rounded-r-2xl ${
                    activeSection === "employment"
                      ? "bg-[#005DE90A] border-b-[#005DE9] text-[#005DE9] "
                      : "bg-[#000F2303]  text-black"
                  }`}
                  onClick={() => setActiveSection("employment")}
                >
                  <h1 className="text-base font-medium ">Employment details</h1>
                </button>
              </div>
              {activeSection === "contact" ? (
                <div>
                  <div className="w-full flex justify-between gap-3 my-2">
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
                          className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          disabled
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
                          className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full my-2">
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
                        className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="w-full my-2">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-xs font-bold text-gray-700"
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
                        className="block w-full pl-[6.5rem] pr-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        disabled
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
                    <input
                      type="text"
                      name="gender"
                      value={formData.gender}
                      className="mt-1 block w-full px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm capitalize"
                      disabled
                    />
                    {/* <Select
                      name="gender"
                      value={formData.gender?.toLowerCase()}
                      data={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                        { value: "other", label: "Other" },
                      ]}
                      
                      className="mt-1 block w-full bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none sm:text-sm"
                    /> */}
                  </div>
                </div>
              ) : (
                <div>
                  {/* Employment details form fields go here */}
                  <div className="w-full">
                    <label
                      htmlFor="position"
                      className="block text-xs font-bold text-gray-700"
                    >
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      placeholder="Type in your position"
                      className="mt-1 block w-full px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      disabled
                    />
                  </div>

                  <div className="w-full mt-4">
                    <label
                      htmlFor="department"
                      className="block text-xs font-bold text-gray-700"
                    >
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.institution}
                      placeholder="Type in your department"
                      className="mt-1 block w-full px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      disabled
                    />
                  </div>
                </div>
              )}

              {/* <div className="w-full gap-2 flex justify-center mt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div> */}
            </div>
            {/* <div className="w-[50%] p-5">
              <label
                htmlFor="fileUpload"
                className="block text-xs font-bold text-gray-700"
              >
                Attachment
              </label>
              <div className="relative mt-1 flex flex-col items-center justify-center w-full h-[90%] border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
                >
                  <div className="text-center">
                    <p className="text-lg text-gray-500">Upload file</p>
                    <p className="text-lg text-gray-400">or drag and drop</p>
                  </div>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  style={{ display: "none" }}
                  className="content-none"
                  disabled
                />
              </div>
            </div> */}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
