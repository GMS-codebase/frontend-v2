import { authorizedApi } from "@/utils/api";
import { Checkbox, Modal, Select, Stepper } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { User } from "solar-icon-set";
import { Upload } from "solar-icon-set";
import { CalendarMinimalistic, Folder2, ShieldWarning } from "solar-icon-set";

type FormData = {
  tin: string;
  year_of_placement: string;
  business_type: string;
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
}: {
  isOpenCompleteProfile: boolean;
  closeCompleteProfile: () => void;
}) => {
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<any>();
  const [formData, setFormData] = useState<FormData>({
    tin: "",
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (activeTab === 1) {
      if (!formData.tin) newErrors.tin = "TIN is required.";
      if (!formData.reg_no_or_school_code)
        newErrors.reg_no_or_school_code =
          "Registration number or school code is required.";
      if (!formData.reg_date)
        newErrors.reg_date = "Registration date is required.";
      if (formData.is_private === undefined)
        newErrors.is_private = "Private status is required.";
      if (!formData.business_type)
        newErrors.business_type = "Business type is required.";
      if (!certificate) newErrors.certificate = "Certificate is required.";
    } else if (activeTab === 2) {
      if (!formData.employee_number)
        newErrors.employee_number = "Employee number is required.";
      if (!formData.business_phone)
        newErrors.business_phone = "Business phone is required.";
      if (!formData.po_box) newErrors.po_box = "PO Box is required.";
      if (!formData.business_address)
        newErrors.business_address = "Business address is required.";
      if (!formData.bank_account)
        newErrors.bank_account = "Bank account is required.";
      if (!formData.year_of_placement)
        newErrors.year_of_placement = "Year of establishment is required.";
      if (!formData.email) newErrors.email = "Business Email  is required.";
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
    console.log(newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setActiveTab((current) => (current < 3 ? current + 1 : current));
    }
  };

  const handlePrev = () =>
    setActiveTab((current) => (current > 0 ? current - 1 : current));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
      if (certificate) {
        submitData.append("certificate", certificate);
      }
      authorizedApi
        .put("/applicant/update/profile", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
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
          closeCompleteProfile();
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
      <div className="w-full h-fit relative bg-white rounded-3xl p-4 pt-10 pb-10 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeCompleteProfile}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-11/12 flex justify-between items-start mt-4">
          <div className="w-[43%] flex flex-col items-start">
            <h1 className="text-2xl font-extrabold">Complete your profile</h1>
            <h2 className="text-[#000F2369] text-lg font-medium w-4/5">
              Provide the below details to complete. Provide the below details
              to complete.
            </h2>
          </div>
          <div className="w-[55%] flex items-center">
            <div
              onClick={() => setActiveTab(1)}
              className={`w-1/3 flex justify-end ${
                activeTab === 1 ? "bg-[#005DE90A]" : ""
              }`}
            >
              <button
                className={`py-2 transition-all duration-300 text-xs w-full font-medium ${
                  activeTab === 1
                    ? "border-b-2 border-[#005DE9] text-[#005DE9]"
                    : ""
                }`}
              >
                Call Details
              </button>
            </div>
            <div
              onClick={() => setActiveTab(2)}
              className={`w-1/3 flex justify-end ${
                activeTab === 2 ? "bg-[#005DE90A]" : ""
              }`}
            >
              <button
                className={`py-2 transition-all duration-200 text-xs w-full font-medium ${
                  activeTab === 2
                    ? "border-b-2 border-[#005DE9] text-[#005DE9]"
                    : ""
                }`}
              >
                Timeline Details
              </button>
            </div>
            <div
              onClick={() => setActiveTab(3)}
              className={`w-1/3 flex justify-start ${
                activeTab === 3 ? "bg-[#005DE90A]" : ""
              }`}
            >
              <button
                className={`py-2 transition-all duration-300 text-xs w-full  font-medium ${
                  activeTab === 3
                    ? "border-b-2 border-[#005DE9] text-[#005DE9]"
                    : ""
                }`}
              >
                Category Details
              </button>
            </div>
          </div>
        </div>

        <div className="w-11/12 flex flex-col items-center mt-4 overflow-hidden">
          {activeTab === 1 && (
            <div className="w-full overflow-y-auto flex flex-col gap-2">
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
                      placeholder="Call title"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  {errors.tin && (
                    <p className="text-red-500 text-sm">{errors.tin}</p>
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
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                    htmlFor="business_type"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Business Type
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Folder2 />
                    </span>
                    <Select
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
                        { label: "School", value: "school" },
                        { label: "Institution", value: "institution" },
                      ]}
                      className="mt-1 block w-full  pl-5  bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Select Business Type"
                    />
                  </div>
                  {errors.business_type && (
                    <p className="text-red-500 text-sm">
                      {errors.business_type}
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
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  {errors.reg_date && (
                    <p className="text-red-500 text-sm">{errors.reg_date}</p>
                  )}
                </div>
              </div>
              <div className="w-full flex justify-between gap-3">
                <div className="w-full">
                  <div className="w-full mt-5">
                    <label
                      htmlFor="is_private"
                      className="block text-xs font-bold text-gray-700"
                    >
                      Is Internal
                    </label>
                    <div className="mt-1 pl-1 flex flex-col gap-2">
                      <Checkbox
                        label="Yes"
                        checked={formData.is_private}
                        onChange={(e: any) =>
                          setFormData({ ...formData, is_private: true })
                        }
                      />
                      <Checkbox
                        label="No"
                        checked={formData.is_private == false}
                        onChange={(e: any) =>
                          setFormData({ ...formData, is_private: false })
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
                    Attachment (Certificate)
                  </label>
                  <div className="flex mt-1 p-4 flex-col items-center justify-center w-full h-[100%] border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
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
                          <p className="text-sm text-gray-500">File selected</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-md text-gray-500">Upload file</p>
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
                        if (e.target.files && e.target.files[0]) {
                          setCertificate(e.target.files[0]);
                        }
                        if (errors.certificate) {
                          setErrors((prevErrors) => {
                            const updatedErrors = { ...prevErrors };
                            delete updatedErrors.certificate;
                            return updatedErrors;
                          });
                        }
                      }}
                      required
                    />
                  </div>
                  {errors.certificate && (
                    <p className="text-red-500 text-sm">{errors.certificate}</p>
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
            <div className="w-full overflow-y-auto flex flex-col gap-2">
              <div className="w-full flex justify-between gap-3">
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
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  {errors.bank_name && (
                    <p className="text-red-500 text-sm">{errors.bank_name}</p>
                  )}
                </div>
              </div>
              <div className="w-full flex justify-between gap-3">
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
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              <div className="w-full flex justify-between gap-3">
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
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
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
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              <div className="w-full flex justify-between gap-3">
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
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  {errors.po_box && (
                    <p className="text-red-500 text-sm">{errors.po_box}</p>
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
            <div className="w-full overflow-y-auto flex flex-col gap-2">
              <div className="w-full flex justify-between gap-3">
                <div className="w-full">
                  <label
                    htmlFor="province"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Province
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Folder2 />
                    </span>
                    <input
                      type="text"
                      name="province"
                      value={formData.province}
                      placeholder="Province"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  {errors.province && (
                    <p className="text-red-500 text-sm">{errors.province}</p>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="district"
                    className="block text-xs font-bold text-gray-700"
                  >
                    District
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <User />
                    </span>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      placeholder="District"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  {errors.district && (
                    <p className="text-red-500 text-sm">{errors.district}</p>
                  )}
                </div>
              </div>
              <div className="w-full flex justify-between gap-3">
                <div className="w-full">
                  <label
                    htmlFor="sector"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Sector
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Folder2 />
                    </span>
                    <input
                      type="text"
                      name="sector"
                      value={formData.sector}
                      placeholder="sector"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  {errors.sector && (
                    <p className="text-red-500 text-sm">{errors.sector}</p>
                  )}
                </div>
                <div className="w-full">
                  <label
                    htmlFor="cell"
                    className="block text-xs font-bold text-gray-700"
                  >
                    Cell
                  </label>
                  <div className="w-full relative">
                    <span className="absolute left-2 top-[10px]">
                      <Folder2 />
                    </span>
                    <input
                      type="text"
                      name="cell"
                      value={formData.cell}
                      placeholder="Cell"
                      onChange={handleChange}
                      className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  {errors.cell && (
                    <p className="text-red-500 text-sm">{errors.cell}</p>
                  )}
                </div>
              </div>

              <div className="w-full">
                <label
                  htmlFor="address"
                  className="block text-xs font-bold text-gray-700"
                >
                  Village
                </label>
                <div className="w-full relative">
                  <span className="absolute left-2 top-[10px]">
                    <Folder2 />
                  </span>
                  <input
                    type="village"
                    name="village"
                    value={formData.village}
                    placeholder="Village"
                    onChange={handleChange}
                    className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                {errors.village && (
                  <p className="text-red-500 text-sm">{errors.village}</p>
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
