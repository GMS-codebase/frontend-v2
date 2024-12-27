/* eslint-disable react-hooks/exhaustive-deps */
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
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import CompleteProfile from "../Modals/application/CompleteProfile";
import UpdateApplicantProfile from "../Modals/applicantContacts/UpdateApplicantProfile";
interface Props {
  type?: string;
}
const ApplicantProfile = ({ type }: Props) => {
  const { profile, applicantProfile: applicantData } = useSelector(
    (state: any) => state.profile,
  );
  const applicantProfile = applicantData?.business;
  console.log("applicant profile --> ", applicantProfile);
  const [activeSection, setActiveSection] = useState("contact");
  const [isUpdateProfile, { open: openUpdate, close }] = useDisclosure(false);
  const [applicant, setApplicant] = useState<any>({});
  const [formData, setFormData] = useState({
    firstName: profile?.firstname,
    lastName: profile?.lastname,
    email: profile?.email,
    phoneNumber: applicantData?.applicant?.phone,
    gender: profile?.gender,
    position: profile?.position,
    institution: profile?.institution,
  });
  useEffect(() => {
    setFormData({
      firstName: profile?.firstname,
      lastName: profile?.lastname,
      email: profile?.email,
      phoneNumber: applicantData?.applicant?.phone,
      gender: profile?.gender,
      position: profile?.position,
      institution: profile?.institution,
    });
  }, [profile]);
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
        <div>
          <div className="w-full h-[180px] bg-[#000F23] rounded-t-2xl relative mb-20">
            <div className="absolute top-[60%] left-[4%]">
              <div className="flex items-end gap-3">
                <button className=" mt-3 bg-white  text-3xl text-primary p-4 rounded-full">
                  <Icons.SolarUserBold className="w-[100px] h-[100px]" />
                </button>
                <div className="">
                  <h1 className="text-2xl">{profile?.firstname}</h1>
                  <h1 className="font-bold text-primary">{profile?.role}</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4 justify-center  p-5">
            <div className="w-full flex flex-col items-center">
              <div className="w-3/5 flex mx-auto mb-10 mt-5">
                <button
                  className={`w-full text-center justify-center border-b-2  py-3 px-7 flex flex-row items-center gap-3 rounded-l-2xl ${
                    activeSection === "contact"
                      ? "bg-[#005DE90A] border-b-[#005DE9] text-[#005DE9]"
                      : "bg-[#000F2303]  text-black"
                  }`}
                  onClick={() => setActiveSection("contact")}
                >
                  <h1 className="text-base font-medium ">
                    Applicant Information
                  </h1>
                </button>
                <button
                  className={`w-full text-center justify-center border-b-2  py-3 px-7 flex flex-row items-center gap-3 rounded-r-2xl ${
                    activeSection === "employment"
                      ? "bg-[#005DE90A] border-b-[#005DE9] text-[#005DE9] "
                      : "bg-[#000F2303]  text-black"
                  }`}
                  onClick={() => setActiveSection("employment")}
                >
                  <h1 className="text-base font-medium ">
                    Business Information
                  </h1>
                </button>
              </div>
              {activeSection === "contact" ? (
                <div className="w-3/4">
                  <div className="w-full flex justify-between gap-3 my-2">
                    <div className="w-full">
                      <label
                        htmlFor="firstName"
                        className="block text-xs font-bold text-gray-700"
                      >
                        First name
                      </label>
                      <div className="w-full relative">
                        <span className="absolute left-2 top-[13px]">
                          <Icons.SolarUserBroken />
                        </span>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          className="mt-1 block w-full pl-8 px-3 py-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                        <span className="absolute left-2 top-[13px]">
                          <Icons.SolarUserBroken />
                        </span>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          className="mt-1 block w-full pl-8 px-3 py-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                      <span className="absolute left-2 top-[13px]">
                        <Icons.SolarLetterLinear />
                      </span>
                      <input
                        type="text"
                        name="email"
                        value={formData.email}
                        className="mt-1 block w-full pl-8 px-3 py-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                          <Icons.SolarIphoneLinear />
                        </span>
                      </div>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        className="block w-full pl-8 pr-3 py-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="w-full my-2">
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold text-gray-700"
                    >
                      Gender
                    </label>
                    <div className="w-full relative">
                      <span className="absolute left-2 top-[13px]">
                        <Icons.PhGenderIntersex />
                      </span>
                      <input
                        type="text"
                        name="text"
                        value={formData.gender}
                        className="mt-1 block w-full pl-8 px-3 py-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-3">
                  <div className="flex font-semibold ">
                    <div className="flex w-1/2">
                      <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                        <div>Business Name</div>
                      </div>
                      <div className="mt-2 ml-4">
                        {applicantProfile?.businessName || ""}
                      </div>
                    </div>
                    <div className="flex w-1/2">
                      <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                        <div>Business Type </div>
                      </div>
                      <div className="mt-2 ml-4">
                        {applicantProfile?.tinNumber || ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex    font-semibold ">
                    <div className="flex w-1/2">
                      <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                        <div>Phone</div>
                      </div>
                      <div className="mt-2 ml-4">{applicantProfile?.phone}</div>
                    </div>
                    <div className="flex w-1/2">
                      <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                        <div>Email</div>
                      </div>
                      <div className="mt-2 ml-4">{applicantProfile?.email}</div>
                    </div>
                  </div>
                  <div className="flex font-semibold ">
                    <div className="flex w-1/2">
                      <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                        <div>TIN</div>
                      </div>
                      <div className="mt-2 ml-4">
                        {applicantProfile?.tinNumber}
                      </div>
                    </div>
                    <div className="flex w-1/2">
                      <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                        <div>Bank</div>
                      </div>
                      <div className="mt-2 ml-4">
                        {applicantProfile?.bankName}
                      </div>
                    </div>
                  </div>
                  <div className="flex font-semibold ">
                    <div className="flex w-1/2">
                      <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                        <div>PO Box</div>
                      </div>
                      <div className="mt-2 ml-4">{applicantProfile?.poBox}</div>
                    </div>
                    <div className="flex w-1/2">
                      <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                        <div>Registration date</div>
                      </div>
                      <div className="mt-2 ml-4">
                        {new Date(
                          applicantProfile?.registrationDate,
                        )?.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex font-semibold ">
                    <div className="flex w-1/2">
                      <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                        <div>Bank Account</div>
                      </div>
                      <div className="mt-2 ml-4">
                        {applicantProfile?.businessAccount}
                      </div>
                    </div>
                    <div className="flex w-1/2">
                      <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                        <div>Year of estabrishment</div>
                      </div>
                      <div className="mt-2 ml-4">
                        {applicantProfile?.yearOfEstablishment}
                      </div>
                    </div>
                  </div>
                  <div className="flex font-semibold items-start ">
                    <div className="flex w-1/2">
                      <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                        <div>Number of Employee</div>
                      </div>
                      <div className="mt-2 ml-4">
                        {applicantProfile?.employeeNumber}
                      </div>
                    </div>
                    <div className="flex w-1/2 items-start">
                      <div className="w-fit  flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                        <div>Address</div>
                      </div>
                      <div className="mt-2 ml-4">
                        {applicantProfile?.addressLine}{" "}
                      </div>
                    </div>
                  </div>
                  <div className="flex    font-semibold ">
                    <div className="flex w-1/2">
                      <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                        <div>Is Private</div>
                      </div>
                      <div className="mt-2 ml-4">
                        {applicantProfile?.private ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="w-full gap-2 flex justify-end mt-4">
                <button
                  type="button"
                  onClick={openUpdate}
                  className="w- px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <CompleteProfile
        defaultData={applicantData?.business}
        isOpenCompleteProfile={isUpdateProfile && activeSection !== "contact"}
        closeCompleteProfile={close}
        finishAddingProfile={() => close()}
      />
      <UpdateApplicantProfile
        defaultData={{ ...profile, phone: applicantData?.applicant?.phone }}
        isOpenUpdateProfile={isUpdateProfile && activeSection === "contact"}
        closeUpdateProfile={close}
        onUpdateProfile={() => close()}
      />
    </div>
  );
};

export default ApplicantProfile;
