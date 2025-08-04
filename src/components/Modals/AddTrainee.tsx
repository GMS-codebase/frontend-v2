// TRAINEE FEATURE COMMENTED OUT
/*
"use client";
import React, { useState } from "react";
import { Modal } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import { authorizedApi } from "@/utils/api";

interface Props {
  isOpenEditTrainee: boolean;
  closeEditTrainee: () => void;
}

const AddTrainee = ({ isOpenEditTrainee, closeEditTrainee }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  // Bulk upload states
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      idNumber: "",
      email: "",
      phone: "",
      gender: "",
      dateOfBirth: null as Date | null,
      maritalStatus: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      phone: (value) =>
        value.length < 10 ? "Phone number must be at least 10 digits" : null,
      dateOfBirth: (value) => (value ? null : "Date of birth is required"),
      maritalStatus: (value) => (value ? null : "Marital status is required"),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const payload = {
        nationalId: values.idNumber,
        name: `${values.firstName} ${values.lastName}`.trim(),
        email: values.email,
        phone: values.phone,
        gender: values.gender.toUpperCase(),
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.toISOString().split("T")[0]
          : undefined,
        maritalStatus: values.maritalStatus,
      };
      await authorizedApi.post("/applicant/trainees", payload);
      setSuccess(true);
      form.reset();
      closeEditTrainee();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add trainee");
    } finally {
      setLoading(false);
    }
  };

  // Bulk upload handlers
  const handleDownloadTemplate = async () => {
    try {
      const response = await authorizedApi.get("/applicant/trainees-upload/template", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "trainee_template.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setUploadError("Failed to download template");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleBulkUpload = async () => {
    if (!file) {
      setUploadError("Please select an Excel file to upload.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await authorizedApi.post("/applicant/trainees/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadSuccess(true);
      setFile(null);
    } catch (err: any) {
      setUploadError(err?.response?.data?.message || "Failed to upload trainees");
    } finally {
      setUploading(false);
    }
  };

  const tabList = [
    { label: "Add Single Trainee" },
    { label: "Upload Excel File" },
  ];

  return (
    <Modal
      size={""}
      opened={isOpenEditTrainee}
      onClose={closeEditTrainee}
      withCloseButton={false}
      centered
    >
      <div className="w-[90vw] min-w-[550px] max-w-[800px] h-auto flex flex-col gap-2 align-middle rounded-2xl bg-white p-0 relative">
        {/* Close Icon }*/
//         <button
//           onClick={closeEditTrainee}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
//           disabled={loading || uploading}
//           aria-label="Close Add Trainee Modal"
//           tabIndex={0}
//         >
//           <IoMdClose size={24} />
//         </button>
//         {/* Modal Header */}
//         <div className="bg-blue-600 rounded-t-2xl px-8 py-4">
//           <h2 className="text-white text-xl font-semibold">Add Trainee</h2>
//           <p className="text-blue-100 text-sm mt-1">Add a single trainee or upload a list using Excel</p>
//         </div>
//         {/* Tabs */}
//         <div className="flex border-b border-gray-200 bg-white px-8 pt-4">
//           {tabList.map((tab, idx) => (
//             <button
//               key={tab.label}
//               className={`relative px-6 py-2 text-base font-medium focus:outline-none transition-colors duration-150 ${
//                 tabIndex === idx
//                   ? "text-blue-600"
//                   : "text-gray-500 hover:text-blue-600"
//               }`}
//               onClick={() => setTabIndex(idx)}
//               tabIndex={0}
//             >
//               {tab.label}
//               {tabIndex === idx && (
//                 <span className="absolute left-0 right-0 -bottom-1 h-1 bg-blue-600 rounded-t"></span>
//               )}
//             </button>
//           ))}
//         </div>
//         {/* Tab Panels */}
//         <div className="px-8 py-8">
//           {tabIndex === 0 && (
//             <>
//               <div className="flex flex-col gap-2 text-center font-bold mb-4">
//                 <h2 className="text-2xl font-bold text-primaryText">
//                   Add New Trainee
//                 </h2>
//                 <p className="text-primaryText opacity-40 font-medium text-xl">
//                   Fill in the details to add a trainee.
//                 </p>
//               </div>
//               <form
//                 onSubmit={form.onSubmit(handleSubmit)}
//                 className="flex flex-col gap-4 text-primaryText"
//               >
//                 <div className="grid grid-cols-2 gap-6">
//                   {/* Row 1: First Name / Last Name */}
//                   <div className="flex flex-col gap-2">
//                     <label htmlFor="firstName" className="font-semibold">
//                       First Name
//                     </label>
//                     <input
//                       type="text"
//                       id="firstName"
//                       placeholder="Enter first name"
//                       className="w-full bg-gray-100 p-4 py-2 rounded-xl outline-primary transition-all duration-150"
//                       required
//                       {...form.getInputProps("firstName")}
//                       disabled={loading}
//                     />
//                   </div>
//                   <div className="flex flex-col gap-2">
//                     <label htmlFor="lastName" className="font-semibold">
//                       Last Name
//                     </label>
//                     <input
//                       type="text"
//                       id="lastName"
//                       placeholder="Enter last name"
//                       className="w-full bg-gray-100 p-4 py-2 rounded-xl outline-primary transition-all duration-150"
//                       required
//                       {...form.getInputProps("lastName")}
//                       disabled={loading}
//                     />
//                   </div>
//                   {/* Row 2: ID Number / Email */}
//                   <div className="flex flex-col gap-2">
//                     <label htmlFor="idNumber" className="font-semibold">
//                       ID Number
//                     </label>
//                     <input
//                       type="text"
//                       id="idNumber"
//                       placeholder="Enter ID number"
//                       className="w-full bg-gray-100 p-4 py-2 rounded-xl outline-primary transition-all duration-150"
//                       required
//                       {...form.getInputProps("idNumber")}
//                       disabled={loading}
//                     />
//                   </div>
//                   <div className="flex flex-col gap-2">
//                     <label htmlFor="email" className="font-semibold">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       id="email"
//                       placeholder="Enter email address"
//                       className="w-full bg-gray-100 p-4 py-2 rounded-xl outline-primary transition-all duration-150"
//                       required
//                       {...form.getInputProps("email")}
//                       disabled={loading}
//                     />
//                   </div>
//                   {/* Row 3: Phone Number / Gender */}
//                   <div className="flex flex-col gap-2">
//                     <label htmlFor="phone" className="font-semibold">
//                       Phone Number
//                     </label>
//                     <input
//                       type="text"
//                       id="phone"
//                       placeholder="Enter phone number"
//                       className="w-full bg-gray-100 p-4 py-2 rounded-xl outline-primary transition-all duration-150"
//                       required
//                       {...form.getInputProps("phone")}
//                       disabled={loading}
//                     />
//                   </div>
//                   <div className="flex flex-col gap-2">
//                     <label htmlFor="gender" className="font-semibold">
//                       Gender
//                     </label>
//                     <select
//                       id="gender"
//                       className="w-full bg-gray-100 p-4 py-2 rounded-xl outline-primary transition-all duration-150"
//                       required
//                       {...form.getInputProps("gender")}
//                       disabled={loading}
//                     >
//                       <option value="" disabled>
//                         Select gender
//                       </option>
//                       <option value="MALE">Male</option>
//                       <option value="FEMALE">Female</option>
//                     </select>
//                   </div>
//                   {/* Row 4: Date of Birth / Marital Status */}
//                   <div className="flex flex-col gap-2">
//                     <label htmlFor="dateOfBirth" className="font-semibold">
//                       Date of Birth
//                     </label>
//                     <DateInput
//                       id="dateOfBirth"
//                       placeholder="Pick date"
//                       value={form.values.dateOfBirth}
//                       onChange={(date) => form.setFieldValue("dateOfBirth", date)}
//                       className="w-full bg-gray-100 p-4 py-2 rounded-xl outline-primary transition-all duration-150"
//                       required
//                       disabled={loading}
//                       maxDate={new Date()}
//                     />
//                   </div>
//                   <div className="flex flex-col gap-2">
//                     <label htmlFor="maritalStatus" className="font-semibold">
//                       Marital Status
//                     </label>
//                     <select
//                       id="maritalStatus"
//                       className="w-full bg-gray-100 p-4 py-2 rounded-xl outline-primary transition-all duration-150"
//                       required
//                       {...form.getInputProps("maritalStatus")}
//                       disabled={loading}
//                     >
//                       <option value="" disabled>
//                         Select marital status
//                       </option>
//                       <option value="SINGLE">Single</option>
//                       <option value="MARRIED">Married</option>
//                     </select>
//                   </div>
//                 </div>
//                 {error && <div className="text-red-500 text-center">{error}</div>}
//                 <div className="border text-center bg-primary rounded-full p-2 text-white font-semibold text-xl mt-2">
//                   <input
//                     type="submit"
//                     value={loading ? "Adding..." : "Add Trainee"}
//                     disabled={loading}
//                   />
//                 </div>
//               </form>
//             </>
//           )}
//           {tabIndex === 1 && (
//             <div className="flex flex-col items-center justify-center gap-6 w-full">
//               <div className="w-full border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center py-12 px-4 bg-gray-50">
//                 <div className="flex flex-col items-center gap-2">
//                   <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-400 mb-2"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-8m0 8l-3-3m3 3l3-3m-9 5a2 2 0 01-2-2V7a2 2 0 012-2h3.5a1 1 0 01.7.3l1.8 1.8a1 1 0 00.7.3H19a2 2 0 012 2v8a2 2 0 01-2 2H5z" /></svg>
//                   <div className="text-lg font-semibold text-gray-700 mb-1">Upload Excel File</div>
//                   <div className="text-gray-500 text-sm mb-4 text-center max-w-xs">Upload an Excel file containing your trainees. The file should follow our template format.</div>
//                   <label htmlFor="trainee-excel-upload" className="inline-block">
//                     <input
//                       id="trainee-excel-upload"
//                       type="file"
//                       accept=".xlsx"
//                       onChange={handleFileChange}
//                       className="hidden"
//                       aria-label="Upload Excel File"
//                       tabIndex={0}
//                       disabled={uploading}
//                     />
//                     <span className="inline-flex items-center px-6 py-2 bg-white border border-blue-400 text-blue-600 rounded-lg font-medium cursor-pointer hover:bg-blue-50 transition disabled:opacity-50" tabIndex={0}>
//                       {file ? file.name : "Select Excel File"}
//                     </span>
//                   </label>
//                   <button
//                     onClick={handleBulkUpload}
//                     className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
//                     disabled={uploading || !file}
//                     aria-label="Upload Trainees Excel"
//                     tabIndex={0}
//                   >
//                     {uploading ? "Uploading..." : "Upload Trainees"}
//                   </button>
//                   {uploadError && <div className="text-red-500 text-center mt-2">{uploadError}</div>}
//                   {uploadSuccess && <div className="text-green-600 text-center mt-2">Trainees uploaded successfully!</div>}
//                 </div>
//               </div>
//               <div className="flex flex-col items-center mt-2">
//                 <span className="text-gray-500 text-sm mb-1">Don&apos;t have the template?</span>
//                 <button
//                   onClick={handleDownloadTemplate}
//                   className="px-4 py-2 bg-white border border-blue-400 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
//                   aria-label="Download Excel Template"
//                   tabIndex={0}
//                 >
//                   Download Sample Template
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default AddTrainee;
// */


export default function Placeholder() {
  return null;
}