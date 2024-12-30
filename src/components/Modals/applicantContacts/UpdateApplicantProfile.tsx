/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { authorizedApi } from "@/utils/api";
import { getApplicantProfile, getProfile } from "@/services";
import { Checkbox, Modal, Select } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { CalendarMinimalistic, Folder2, ShieldWarning } from "solar-icon-set";
import * as Icons from "@/components/core/icons";

// @typescript-eslint/no-var-requires
const { Provinces, Districts, Sectors, Cells, Villages } = require("rwanda");

type FormData = {
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  old_password: string,
  phone_number: string,
  province: string,
  district: string,
  sector: string,
  cell: string,
  village: string,
  gender: string,
  position: string,
};

const UpdateApplicantProfile = ({
  isOpenUpdateProfile,
  closeUpdateProfile,
  onUpdateProfile,
  defaultData,
}: {
  isOpenUpdateProfile: boolean;
  closeUpdateProfile: () => void;
  onUpdateProfile?: () => void;
  defaultData?: any;
}) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<any>();
  console.log("default data --> ", defaultData);
  const [formData, setFormData] = useState<FormData>({
    first_name: defaultData?.firstname,
    last_name: defaultData?.lastname,
    email: defaultData?.email,
    phone_number: defaultData?.phone,
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    password: "",
    old_password: "",
    gender: "",
    position: "",
  });
  useEffect(() => {
    setFormData({
      first_name: defaultData?.firstname || "",
      last_name: defaultData?.lastname || "",
      email: defaultData?.email || "",
      phone_number: defaultData?.phone || "",
      gender: defaultData?.gender || "",
      position: defaultData?.position || "",
      province: "",
      district: "",
      sector: "",
      cell: "",
      village: "",
      old_password: "",
      password: ""
    });
  }, [defaultData]);
  const ProvincesOptions = Provinces();
  const DistrictOptions = formData.province ? Districts(formData.province) : [];
  const SectorOptions =
    formData.district && formData.province
      ? Sectors(formData.province, formData.district)
      : [];
  const CellOptions =
    formData.sector && formData.district && formData.province
      ? Cells(formData.province, formData.district, formData.sector)
      : [];
  const VillageOptions =
    formData.cell && formData.sector && formData.district && formData.province
      ? Villages(
          formData.province,
          formData.district,
          formData.sector,
          formData.cell,
        )
      : [];
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "province" && {
        district: "",
        sector: "",
        cell: "",
        village: "",
      }),
      ...(name === "district" && { sector: "", cell: "", village: "" }),
      ...(name === "sector" && { cell: "", village: "" }),
      ...(name === "cell" && { village: "" }),
    }));

    if (errors[name]) {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key as keyof FormData] as string);
    });
    if (certificate) {
      submitData.append("certificate", certificate);
    }
    authorizedApi
      .put("/auth/update/info", formData)
      .then((_res) => {
        notifications.show({
          message: "Profile updated successfully!",
          color: "green",
        });
        console.log("profile updated successfully!");
        getApplicantProfile(dispatch);
        getProfile(dispatch)
        onUpdateProfile && onUpdateProfile();
      })
      .catch((err) => {
        notifications.show({
          message:
            err.response?.data?.message ||
            "Failed to update profile. Please try again.",
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      size={"lg"}
      opened={isOpenUpdateProfile}
      onClose={closeUpdateProfile}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-full h-fit relative bg-white rounded-3xl p-4 pt-10 pb-10 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeUpdateProfile}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="  my-4 text-center w-full">
          <h1 className="text-2xl font-extrabold">Update Applicant Info</h1>
          {!defaultData && (
            <h2 className="text-[#000F2369] text-lg font-medium 5">
              Change the below details to update.
            </h2>
          )}
        </div>

        <div className="w-11/12 flex flex-col items-center mt-4 overflow-hidden">
          <div className="w-full">
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
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-8 px-3 py-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-8 px-3 py-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  onChange={handleChange}
                  className="mt-1 block w-full pl-8 px-3 py-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="block w-full pl-8 pr-3 py-3 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                <Select
                  name="gender"
                  placeholder="Select Gender"
                  data={[
                    {
                      value: "male",
                      label: "Male",
                    },
                    {
                      value: "female",
                      label: "Female",
                    }
                  ]}
                  value={formData.gender}
                  onChange={(e: any) => setFormData({ ...formData, gender: e })}
                  className="mt-1 block w-full pl-5 px-3 py-1 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="w-full flex justify-center mt-10 space-x-4">
                <button
                  type="button"
                  onClick={closeUpdateProfile}
                  className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  type="button"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {loading ? "Loading" : "Update"}
                </button>
              </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default UpdateApplicantProfile;
