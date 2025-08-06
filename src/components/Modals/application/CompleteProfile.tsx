/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { authorizedApi } from "@/utils/api";
import { getApplicantProfile } from "@/services";
import { Checkbox, Modal, Select } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { User } from "solar-icon-set";
import { Upload } from "solar-icon-set";
import { CalendarMinimalistic, Folder2, ShieldWarning } from "solar-icon-set";
// @typescript-eslint/no-var-requires
const { Provinces, Districts, Sectors, Cells, Villages } = require("rwanda");

type FormData = {
  tin: string;
  year_of_placement: string;
  business_type: string;
  business_name: string;
  reg_no_or_school_code: string;
  reg_date: string;
  is_private: boolean;
  employee_number: number;
  bank_name: string;
  bank_account: string;
  business_phone: string;
  email: string;
  po_box: string;
  business_address: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
};

const CompleteProfile = ({
  isOpenCompleteProfile,
  closeCompleteProfile,
  finishAddingProfile,
  defaultData,
}: {
  isOpenCompleteProfile: boolean;
  closeCompleteProfile: () => void;
  finishAddingProfile?: () => void;
  defaultData?: any;
}) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<any>();
  const [formData, setFormData] = useState<FormData>({
    tin: "",
    business_name: "",
    year_of_placement: "",
    business_type: "",
    reg_no_or_school_code: "",
    reg_date: "",
    is_private: false,
    employee_number: 0,
    bank_name: "",
    bank_account: "",
    business_phone: "",
    email: "",
    po_box: "",
    business_address: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
  });
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

  useEffect(() => {
    if (defaultData) {
      console.log("default data --> ", defaultData);
      const locations = defaultData?.addressLine?.split("-");
      setFormData({
        tin: defaultData?.tinNumber,
        is_private: defaultData?.private,
        reg_no_or_school_code: defaultData?.registrationNumber,
        reg_date: defaultData?.registrationDate,
        business_phone: defaultData.phone,
        year_of_placement: defaultData.yearOfEstablishment,
        business_address: defaultData?.addressLine,
        employee_number: defaultData.employeeNumber,
        business_type: defaultData?.businessType,
        bank_name: defaultData?.bankName,
        bank_account: defaultData?.businessAccount,
        po_box: defaultData?.poBox,
        province: locations[4]?.split(" ")[1],
        district: locations[3]?.split(" ")[1],
        sector: locations[2]?.split(" ")[1],
        cell: locations[1]?.split(" ")[1],
        village: locations[0]?.split(" ")[0],
        email: defaultData?.email,
        business_name: defaultData?.businessName,
      });
      setCertificate(defaultData?.businessCertificate);
      setErrors({});
    }
  }, [defaultData]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (activeTab === 1) {
      if (!formData.tin) newErrors.tin = "TIN is required.";
      if (!formData.business_name)
        newErrors.business_name = "Institution Name is required.";
      if (!formData.reg_no_or_school_code)
        newErrors.reg_no_or_school_code =
          "Registration number or school code is required.";
      if (!formData.reg_date)
        newErrors.reg_date = "Registration date is required.";
      if (formData.is_private === undefined)
        newErrors.is_private = "Private status is required.";
      if (!formData.business_type)
        newErrors.business_type = "Institution type is required.";
      if (!certificate && !defaultData)
        newErrors.certificate = "Certificate is required.";
    } else if (activeTab === 2) {
      if (!formData.employee_number)
        newErrors.employee_number = "Employee number is required.";
      if (!formData.business_phone)
        newErrors.business_phone = "Institution phone is required.";
      if (!formData.po_box) newErrors.po_box = "PO Box is required.";
      if (!formData.business_address)
        newErrors.business_address = "Institution address is required.";
      if (!formData.bank_account)
        newErrors.bank_account = "Bank account is required.";
      if (!formData.year_of_placement)
        newErrors.year_of_placement = "Year of establishment is required.";
      if (!formData.email) newErrors.email = "Institution Email  is required.";
      if (!formData.bank_name) newErrors.bank_name = "Bank name is required.";
    } else if (activeTab === 3) {
      if (!formData.year_of_placement)
        newErrors.year_of_placement = "Year of placement is required.";
      if (!formData.sector) newErrors.sector = "Sector is required.";
      if (!formData.province) newErrors.province = "Province is required.";
      if (!formData.district) newErrors.district = "District is required.";
      if (!formData.cell) newErrors.cell = "Cell is required.";
      if (!formData.village) newErrors.village = "Village is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleNext = () => {
    if (validate()) {
      setActiveTab((current) => (current < 3 ? current + 1 : current));
    }
  };

  const handlePrev = () =>
    setActiveTab((current) => (current > 1 ? current - 1 : current));

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
    if (validate()) {
      setLoading(true);
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key as keyof FormData] as string);
      });
      submitData.append("isprivate", String(formData.is_private));
      const updateData = submitData;
      const payload = defaultData ? updateData : submitData;
      updateData.append("year_of_establishment", formData.year_of_placement);
      updateData.append(
        "number_of_employees",
        String(formData.employee_number),
      );
      updateData.append("phone", formData.business_phone);
      if (certificate) {
        submitData.append("certificate", certificate);
      }
      const endPoint = "/applicant/update/business";
      (defaultData
        ? authorizedApi.put(endPoint, payload, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : authorizedApi.post("/applicant/complete/profile", payload, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
      )
        .then((_res) => {
          notifications.show({
            message: "Profile updated successfully!",
            color: "green",
          });
          setFormData({
            tin: "",
            year_of_placement: "",
            business_type: "",
            reg_no_or_school_code: "",
            reg_date: "",
            is_private: false,
            employee_number: 0,
            bank_name: "",
            bank_account: "",
            business_name: "",
            business_phone: "",
            email: "",
            po_box: "",
            business_address: "",
            province: "",
            district: "",
            sector: "",
            cell: "",
            village: "",
          });
          console.log("profile updated successfully!");
          getApplicantProfile(dispatch);
          finishAddingProfile && finishAddingProfile();
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
    }
  };

  return (
      <Modal
          size={"xl"}
          opened={isOpenCompleteProfile}
          onClose={closeCompleteProfile}
          closeOnClickOutside={false}
          withCloseButton={false}
      >
          <div className="w-full h-fit relative bg-white  rounded-3xl p-4 pt-10 pb-10 flex flex-col sm:flex sm:flex-row items-center">
              <button
                  className={
                      "absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
                  }
                  onClick={closeCompleteProfile}
              >
                  <IoMdClose size={25} color={"#000"} />
              </button>
              <div className="  my-4 text-center w-full">
                  <h1 className="text-2xl font-extrabold">
                      {defaultData ? "Update business" : "Complete your"}{" "}
                      profile
                  </h1>
                  {!defaultData && (
                      <h2 className="text-[#000F2369] text-lg font-medium 5">
                          Provide the below details to complete.
                      </h2>
                  )}
              </div>

              <div className="w-11/12 flex flex-col sm:flex sm:flex-row items-center mt-4 overflow-hidden">
                  {activeTab === 1 && (
                      <div className="w-full overflow-y-auto flex flex-col gap-2">
                          <div className="w-full flex justify-between gap-3">
                              <div className="w-full">
                                  <label
                                      htmlFor="business_name"
                                      className="block text-xs font-bold text-gray-700"
                                  >
                                      Institution Name
                                  </label>
                                  <div className="w-full relative">
                                      <span className="absolute left-2 top-[10px]">
                                          <Folder2 />
                                      </span>
                                      <input
                                          type="text"
                                          name="business_name"
                                          value={formData.business_name}
                                          placeholder="Institution Name"
                                          onChange={handleChange}
                                          className="mt-1 block w-full pl-8 px-3 py-2.5 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                                          required
                                      />
                                  </div>
                                  {errors.business_name && (
                                      <p className="text-red-500 text-sm">
                                          {errors.business_name}
                                      </p>
                                  )}
                              </div>
                              <div className="w-full">
                                  <label
                                      htmlFor="reg_no_or_school_code"
                                      className="block text-xs font-bold text-gray-700"
                                  >
                                      Registration Number
                                  </label>
                                  <div className="w-full relative">
                                      <span className="absolute left-2 top-[10px]">
                                          <User />
                                      </span>
                                      <input
                                          type="text"
                                          name="reg_no_or_school_code"
                                          value={formData.reg_no_or_school_code}
                                          placeholder="Registration number"
                                          onChange={handleChange}
                                          className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                                          required
                                      />
                                  </div>
                                  {errors.reg_no_or_school_code && (
                                      <p className="text-red-500 text-sm">
                                          {errors.reg_no_or_school_code}
                                      </p>
                                  )}
                              </div>
                          </div>
                          <div className="w-full flex justify-between gap-3">
                              <div className="w-full">
                                  <label
                                      htmlFor="TIN"
                                      className="block text-xs font-bold text-gray-700"
                                  >
                                      TIN
                                  </label>
                                  <div className="w-full relative">
                                      <span className="absolute left-2 top-[10px]">
                                          <Folder2 />
                                      </span>
                                      <input
                                          type="text"
                                          name="tin"
                                          value={formData.tin}
                                          placeholder="TIN"
                                          onChange={handleChange}
                                          className="mt-1 block w-full pl-8 px-3 py-2.5 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                                          required
                                      />
                                  </div>
                                  {errors.tin && (
                                      <p className="text-red-500 text-sm">
                                          {errors.tin}
                                      </p>
                                  )}
                              </div>
                              <div className="w-full">
                                  <label
                                      htmlFor="reg_date"
                                      className="block text-xs font-bold text-gray-700"
                                  >
                                      Registration Date
                                  </label>
                                  <div className="w-full relative">
                                      <span className="absolute left-2 top-[10px]">
                                          <Folder2 />
                                      </span>
                                      <input
                                          type="date"
                                          name="reg_date"
                                          value={formData.reg_date}
                                          placeholder="Registration Date"
                                          onChange={handleChange}
                                          max={
                                              new Date()
                                                  .toISOString()
                                                  .split("T")[0]
                                          }
                                          className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                                          required
                                      />
                                  </div>
                                  {errors.reg_date && (
                                      <p className="text-red-500 text-sm">
                                          {errors.reg_date}
                                      </p>
                                  )}
                              </div>
                          </div>
                          <div className="w-full flex justify-between gap-3">
                              <div className="w-full">
                                  <div className="w-full">
                                      <label
                                          htmlFor="business_type"
                                          className="block text-xs font-bold text-gray-700"
                                      >
                                          Institution Type
                                      </label>
                                      <div className="w-full relative">
                                          <span className="absolute left-2 top-[10px]">
                                              <Folder2 />
                                          </span>
                                          <Select
                                              defaultValue={null}
                                              clearable={true}
                                              name="business_type"
                                              value={formData.business_type}
                                              onChange={(value: any) => {
                                                  setFormData((prevData) => ({
                                                      ...prevData,
                                                      business_type: value,
                                                  }));
                                                  //@ts-ignore
                                                  errors.business_type &&
                                                      setErrors((prevData) => ({
                                                          ...prevData,
                                                          business_type: "",
                                                      }));
                                              }}
                                              data={[
                                                  {
                                                      label: "Company",
                                                      value: "company",
                                                  },
                                                  {
                                                      label: "Cooperative",
                                                      value: "cooperative",
                                                  },
                                                  {
                                                      label: "NGO",
                                                      value: "ngo",
                                                  },
                                                  {
                                                      label: "Trade Union",
                                                      value: "tradeUnion",
                                                  },
                                                  {
                                                      label: "Association",
                                                      value: "association",
                                                  },
                                                  {
                                                      label: "School",
                                                      value: "school",
                                                  },
                                                  {
                                                      label: "Training Center(VTC)",
                                                      value: "training center",
                                                  },
                                              ]}
                                              className="mt-1 block w-full  pl-5  bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                                              placeholder="Select Institution type"
                                          />
                                      </div>
                                      {errors.business_type && (
                                          <p className="text-red-500 text-sm">
                                              {errors.business_type}
                                          </p>
                                      )}
                                  </div>
                                  <div className="w-full mt-5">
                                      <label
                                          htmlFor="is_private"
                                          className="block text-xs font-bold text-gray-700"
                                      >
                                          Is Private
                                      </label>
                                      <div className="mt-1 pl-1 flex flex-col gap-2">
                                          <Checkbox
                                              label="Yes"
                                              checked={formData.is_private}
                                              onChange={(e: any) =>
                                                  setFormData({
                                                      ...formData,
                                                      is_private: true,
                                                  })
                                              }
                                          />
                                          <Checkbox
                                              label="No"
                                              checked={
                                                  formData.is_private == false
                                              }
                                              onChange={(e: any) =>
                                                  setFormData({
                                                      ...formData,
                                                      is_private: false,
                                                  })
                                              }
                                          />
                                      </div>
                                      {errors.is_private && (
                                          <p className="text-red-500 text-sm">
                                              {errors.is_private}
                                          </p>
                                      )}
                                  </div>
                              </div>
                              <div className="w-full">
                                  <label
                                      htmlFor="fileUpload"
                                      className="block text-xs font-bold text-gray-700"
                                  >
                                      Attachment (Recognized Registration
                                      Certificate/ Accreditation)
                                  </label>
                                  <div className="flex mt-1 p-4 flex-col items-center justify-center w-full h-[100%] border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ">
                                      <label
                                          htmlFor="file-upload"
                                          className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
                                      >
                                          <Upload className="text-[#005DE9] w-64 h-64" />
                                          {certificate ? (
                                              <div className="text-center">
                                                  <p className="text-md font-medium text-gray-700">
                                                      {certificate.name}
                                                  </p>
                                                  <p className="text-sm text-gray-500">
                                                      File selected
                                                  </p>
                                              </div>
                                          ) : (
                                              <div className="text-center">
                                                  <p className="text-md text-gray-500">
                                                      Upload file
                                                  </p>
                                                  <p className="text-md text-gray-400">
                                                      or drag and drop
                                                  </p>
                                              </div>
                                          )}
                                      </label>
                                      <input
                                          id="file-upload"
                                          name="certificate"
                                          type="file"
                                          accept=".pdf"
                                          style={{ display: "none" }}
                                          onChange={(e) => {
                                              if (
                                                  e.target.files &&
                                                  e.target.files[0]
                                              ) {
                                                  setCertificate(
                                                      e.target.files[0]
                                                  );
                                              }
                                              if (errors.certificate) {
                                                  setErrors((prevErrors) => {
                                                      const updatedErrors = {
                                                          ...prevErrors,
                                                      };
                                                      delete updatedErrors.certificate;
                                                      return updatedErrors;
                                                  });
                                              }
                                          }}
                                          required
                                      />
                                  </div>
                                  {errors.certificate && (
                                      <p className="text-red-500 text-sm">
                                          {errors.certificate}
                                      </p>
                                  )}
                              </div>
                          </div>

                          <div className="w-full flex justify-center mt-10 space-x-4">
                              <button
                                  type="button"
                                  onClick={handlePrev}
                                  className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              >
                                  Prev
                              </button>
                              <button
                                  onClick={handleNext}
                                  type="button"
                                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              >
                                  Next
                              </button>
                          </div>
                      </div>
                  )}
                  {activeTab === 2 && (
                      <div className="w-full overflow-y-auto flex flex-col gap-2 sm:flex sm:flex-row">
                          <div className="w-full flex justify-between gap-3 sm:flex sm:flex-row">
                              <div className="w-full">
                                  <label
                                      htmlFor="employee_number"
                                      className="block text-xs font-bold text-gray-700"
                                  >
                                      Employee Number
                                  </label>
                                  <div className="w-full relative">
                                      <span className="absolute left-2 top-[10px]">
                                          <Folder2 />
                                      </span>
                                      <input
                                          type="text"
                                          name="employee_number"
                                          value={formData.employee_number}
                                          placeholder="Employee Number"
                                          onChange={handleChange}
                                          className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                                          required
                                      />
                                  </div>
                                  {errors.employee_number && (
                                      <p className="text-red-500 text-sm">
                                          {errors.employee_number}
                                      </p>
                                  )}
                              </div>
                              <div className="w-full">
                                  <label
                                      htmlFor="bank_name"
                                      className="block text-xs font-bold text-gray-700"
                                  >
                                      Bank Name
                                  </label>
                                  <div className="w-full relative">
                                      <span className="absolute left-2 top-[10px]">
                                          <User />
                                      </span>
                                      <input
                                          type="text"
                                          name="bank_name"
                                          value={formData.bank_name}
                                          placeholder="Bank Name"
                                          onChange={handleChange}
                                          className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                                          required
                                      />
                                  </div>
                                  {errors.bank_name && (
                                      <p className="text-red-500 text-sm">
                                          {errors.bank_name}
                                      </p>
                                  )}
                              </div>
                          </div>
                          <div className="w-full flex justify-between gap-3 sm:flex sm:flex-row">
                              <div className="w-full">
                                  <label
                                      htmlFor="year_of_placement"
                                      className="block text-xs font-bold text-gray-700"
                                  >
                                      Year of establishment
                                  </label>
                                  <div className="w-full relative">
                                      <span className="absolute left-2 top-[10px]">
                                          <Folder2 />
                                      </span>
                                      <input
                                          type="number"
                                          name="year_of_placement"
                                          value={formData.year_of_placement}
                                          placeholder="year of establishment"
                                          onChange={handleChange}
                                          className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                                          required
                                      />
                                  </div>
                                  {errors.year_of_placement && (
                                      <p className="text-red-500 text-sm">
                                          {errors.year_of_placement}
                                      </p>
                                  )}
                              </div>
                              <div className="w-full">
                                  <label
                                      htmlFor="bank_account"
                                      className="block text-xs font-bold text-gray-700"
                                  >
                                      Bank Account
                                  </label>
                                  <div className="w-full relative">
                                      <span className="absolute left-2 top-[10px]">
                                          <User />
                                      </span>
                                      <input
                                          type="text"
                                          name="bank_account"
                                          value={formData.bank_account}
                                          placeholder="Bank Account"
                                          onChange={handleChange}
                                          className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                                          required
                                      />
                                  </div>
                                  {errors.bank_account && (
                                      <p className="text-red-500 text-sm">
                                          {errors.bank_account}
                                      </p>
                                  )}
                              </div>
                          </div>
                          <div className="w-full flex justify-between gap-3 sm:flex sm:flex-row">
                              <div className="w-full">
                                  <label
                                      htmlFor="email"
                                      className="block text-xs font-bold text-gray-700"
                                  >
                                      Email
                                  </label>
                                  <div className="w-full relative">
                                      <span className="absolute left-2 top-[10px]">
                                          <Folder2 />
                                      </span>
                                      <input
                                          type="email"
                                          name="email"
                                          value={formData.email}
                                          placeholder="Type the email"
                                          onChange={handleChange}
                                          className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                                          required
                                      />
                                  </div>
                                  {errors.email && (
                                      <p className="text-red-500 text-sm">
                                          {errors.email}
                                      </p>
                                  )}
                              </div>
                              <div className="w-full">
                                  <label
                                      htmlFor="business_phone"
                                      className="block text-xs font-bold text-gray-700"
                                  >
                                      Phone
                                  </label>
                                  <div className="w-full relative">
                                      <span className="absolute left-2 top-[10px]">
                                          <Folder2 />
                                      </span>
                                      <input
                                          type="number"
                                          name="business_phone"
                                          value={formData.business_phone}
                                          placeholder="Phone number"
                                          onChange={handleChange}
                                          className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                                          required
                                      />
                                  </div>
                                  {errors.business_phone && (
                                      <p className="text-red-500 text-sm">
                                          {errors.business_phone}
                                      </p>
                                  )}
                              </div>
                          </div>
                          <div className="w-full flex justify-between gap-3 sm:flex sm:flex-row">
                              <div className="w-full">
                                  <label
                                      htmlFor="business_address"
                                      className="block text-xs font-bold text-gray-700"
                                  >
                                      Address
                                  </label>
                                  <div className="w-full relative">
                                      <span className="absolute left-2 top-[10px]">
                                          <Folder2 />
                                      </span>
                                      <input
                                          type="address"
                                          name="business_address"
                                          value={formData.business_address}
                                          placeholder="Address"
                                          onChange={handleChange}
                                          className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                                          required
                                      />
                                  </div>
                                  {errors.business_address && (
                                      <p className="text-red-500 text-sm">
                                          {errors.business_address}
                                      </p>
                                  )}
                              </div>
                              <div className="w-full">
                                  <label
                                      htmlFor="po_box"
                                      className="block text-xs font-bold text-gray-700"
                                  >
                                      PO box
                                  </label>
                                  <div className="w-full relative">
                                      <span className="absolute left-2 top-[10px]">
                                          <Folder2 />
                                      </span>
                                      <input
                                          type="text"
                                          name="po_box"
                                          value={formData.po_box}
                                          placeholder="PO box"
                                          onChange={handleChange}
                                          className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
                                          required
                                      />
                                  </div>
                                  {errors.po_box && (
                                      <p className="text-red-500 text-sm">
                                          {errors.po_box}
                                      </p>
                                  )}
                              </div>
                          </div>

                          <div className="w-full flex justify-center mt-10 space-x-4">
                              <button
                                  type="button"
                                  onClick={handlePrev}
                                  className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              >
                                  Prev
                              </button>
                              <button
                                  onClick={handleNext}
                                  type="button"
                                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              >
                                  Next
                              </button>
                          </div>
                      </div>
                  )}
                  {activeTab === 3 && (
                      <div className="w-full overflow-y-auto flex flex-col gap-2 sm:flex sm:flex-row">
                          <div className="w-full flex justify-between gap-3">
                              <div className="w-full">
                                  <label
                                      htmlFor="province"
                                      className="block text-xs font-bold text-gray-700"
                                  >
                                      Province
                                  </label>
                                  <select
                                      name="province"
                                      value={formData.province}
                                      onChange={handleChange}
                                      className="items-center px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500  block w-full"
                                  >
                                      <option value="">Select Province</option>
                                      {ProvincesOptions?.map(
                                          (option: string, index: number) => (
                                              <option
                                                  key={index}
                                                  value={option}
                                              >
                                                  {option}
                                              </option>
                                          )
                                      )}
                                  </select>
                                  {errors.province && (
                                      <p className="text-red-500 text-sm">
                                          {errors.province}
                                      </p>
                                  )}
                              </div>

                              <div className="w-full">
                                  <label
                                      htmlFor="district"
                                      className="block text-xs font-bold text-gray-700"
                                  >
                                      District
                                  </label>
                                  <select
                                      name="district"
                                      value={formData.district}
                                      onChange={handleChange}
                                      className="items-center px-3 py-2  bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500  block w-full"
                                  >
                                      <option value="">Select District</option>
                                      {DistrictOptions?.map(
                                          (option: string, index: number) => (
                                              <option
                                                  key={index}
                                                  value={option}
                                              >
                                                  {option}
                                              </option>
                                          )
                                      )}
                                  </select>
                                  {errors.district && (
                                      <p className="text-red-500 text-sm">
                                          {errors.district}
                                      </p>
                                  )}
                              </div>
                          </div>

                          <div className="w-full flex justify-between gap-3 sm:flex sm:flex-row">
                              <div className="w-full">
                                  <label
                                      htmlFor="sector"
                                      className="block text-xs font-bold text-gray-700"
                                  >
                                      Sector
                                  </label>
                                  <select
                                      name="sector"
                                      value={formData.sector}
                                      onChange={handleChange}
                                      className="items-center px-3 py-2 block bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500  block w-full"
                                  >
                                      <option value="">Select Sector</option>
                                      {SectorOptions?.map(
                                          (option: string, index: number) => (
                                              <option
                                                  key={index}
                                                  value={option}
                                              >
                                                  {option}
                                              </option>
                                          )
                                      )}
                                  </select>
                                  {errors.sector && (
                                      <p className="text-red-500 text-sm">
                                          {errors.sector}
                                      </p>
                                  )}
                              </div>

                              <div className="w-full">
                                  <label
                                      htmlFor="cell"
                                      className="block text-xs font-bold text-gray-700"
                                  >
                                      Cell
                                  </label>
                                  <select
                                      name="cell"
                                      value={formData.cell}
                                      onChange={handleChange}
                                      className="items-center px-3 py-2 block bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500  block w-full"
                                  >
                                      <option value="">Select Cell</option>
                                      {CellOptions?.map(
                                          (option: string, index: number) => (
                                              <option
                                                  key={index}
                                                  value={option}
                                              >
                                                  {option}
                                              </option>
                                          )
                                      )}
                                  </select>
                                  {errors.cell && (
                                      <p className="text-red-500 text-sm">
                                          {errors.cell}
                                      </p>
                                  )}
                              </div>
                          </div>

                          <div className="w-full">
                              <label
                                  htmlFor="village"
                                  className="block text-xs font-bold text-gray-700"
                              >
                                  Village
                              </label>
                              <select
                                  name="village"
                                  value={formData.village}
                                  onChange={handleChange}
                                  className="items-center px-3 py-2  bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500  block w-full"
                              >
                                  <option value="">Select Village</option>
                                  {VillageOptions?.map(
                                      (option: string, index: number) => (
                                          <option key={index} value={option}>
                                              {option}
                                          </option>
                                      )
                                  )}
                              </select>
                              {errors.village && (
                                  <p className="text-red-500 text-sm">
                                      {errors.village}
                                  </p>
                              )}
                          </div>

                          <div className="w-full flex justify-center mt-10 space-x-4">
                              <button
                                  type="button"
                                  onClick={handlePrev}
                                  className="w-full px-4 py-2 bg-[#000F23] text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              >
                                  Prev
                              </button>
                              <button
                                  onClick={handleSubmit}
                                  type="button"
                                  disabled={loading}
                                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              >
                                  {loading ? "Loading" : "Save"}
                              </button>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      </Modal>
  );
};

export default CompleteProfile;
