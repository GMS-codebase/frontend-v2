import { handleDownloadFile, handleViewFile } from "@/utils/funcs";
import { Select } from "@mantine/core";
import { useState } from "react";
import { FaDownload } from "react-icons/fa";

export const Page4 = ({
  data,
  files,
  setData,
  comments,
  setComments,
  isApplicant,
}: {
  data: any;
  files: any;
  setData?: any;
  comments?: any;
  setComments?: any;
  isApplicant?: boolean;
}) => {
  const [staffInputs, setStaffInputs] = useState({
    number: "",
    position: "",
    qualification: "",
    available: "",
  });

  const [errors, setErrors] = useState({
    number: "",
    position: "",
    qualification: "",
    available: "",
  });

  const validateStaffInputs = () => {
    const { number, position, qualification, available } = staffInputs;
    const newErrors = {
      number: number ? "" : "Staff number is required.",
      position: position ? "" : "Position is required.",
      qualification: qualification ? "" : "Qualification is required.",
      available: available ? "" : "Availability is required.",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const addStaff = () => {
    if (!validateStaffInputs()) {
      return;
    }
    setData("staffs", [...data.staffs, staffInputs]);
    setStaffInputs({
      number: "",
      position: "",
      qualification: "",
      available: "",
    });
    setErrors({
      number: "",
      position: "",
      qualification: "",
      available: "",
    });
  };

  const handleCommentChange = (inputName: string, value: any) => {
    if (setComments) {
      setComments((prev: any) => ({
        ...prev,
        [inputName]: value,
      }));
    }
  };

  return (
    <div className="">
      <h3 className="text-lg font-bold">Staff Information</h3>
      <p className="text-sm text-gray-600">
        Add details of the staff involved in the training process.
      </p>
      {setData && !comments && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Staff Number
              </label>
              <input
                type="number"
                placeholder="Number"
                value={staffInputs.number}
                onChange={(e) =>
                  setStaffInputs((prev) => ({
                    ...prev,
                    number: e.target.value,
                  }))
                }
                className={`mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full ${
                  errors.number ? "border-red-500" : ""
                }`}
              />
              {errors.number && (
                <p className="text-red-500 text-sm mt-1">{errors.number}</p>
              )}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <input
                type="text"
                placeholder="Position"
                value={staffInputs.position}
                onChange={(e) =>
                  setStaffInputs((prev) => ({
                    ...prev,
                    position: e.target.value,
                  }))
                }
                className={`mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full ${
                  errors.position ? "border-red-500" : ""
                }`}
              />
              {errors.position && (
                <p className="text-red-500 text-sm mt-1">{errors.position}</p>
              )}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Qualification
              </label>
              <input
                type="text"
                placeholder="Qualification"
                value={staffInputs.qualification}
                onChange={(e) =>
                  setStaffInputs((prev) => ({
                    ...prev,
                    qualification: e.target.value,
                  }))
                }
                className={`mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full ${
                  errors.qualification ? "border-red-500" : ""
                }`}
              />
              {errors.qualification && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.qualification}
                </p>
              )}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                Availability
              </label>
              <Select
                name="available"
                value={staffInputs.available}
                onChange={(value: string | null) =>
                  setStaffInputs((prev) => ({
                    ...prev,
                    available: value ?? "",
                  }))
                }
                data={[
                  { value: "available", label: "Available" },
                  { value: "to be hired", label: "To Be Hired" },
                ]}
                className="border pt-2 mt-2 w-full bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Select Availability"
              />
              {errors.available && (
                <p className="text-red-500 text-sm mt-1">{errors.available}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={addStaff}
              className="mt-2 p-2 bg-primary text-white px-20 rounded-2xl"
            >
              Add
            </button>
          </div>
        </div>
      )}
      {data?.staffs?.length > 0 && (
        <>
          <table className="w-full mt-4 border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Position</th>
                <th className="border p-2">Number of Staff</th>
                <th className="border p-2">Qualification</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.staffs.map((item: any, index: any) => (
                <tr key={index}>
                  <td className="border p-2">{item.position}</td>
                  <td className="border p-2">{item.number}</td>
                  <td className="border p-2">{item.qualification}</td>
                  <td className="border p-2">
                    {item.available?.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h3 className="text-lg font-bold">Staffs CVs Attachment</h3>
      <p className="text-sm text-gray-600">
        Please attach the document containing the cvs of the staffs
      </p>
      {comments ? (
        <>
          <div className="grid grid-cols-2 gap-2 my-2">
            <button
              onClick={() =>
                handleViewFile(data?.staffAttachment, "applications")
              }
              className={`bg-gray-200  text-black font-semibold rounded-full w-full py-2 flex gap-2 items-center justify-center`}
            >
              View File
            </button>
            <button
              onClick={() =>
                handleDownloadFile(data?.staffAttachment, "applications")
              }
              className={` bg-primary  text-white font-semibold rounded-full w-full py-2 flex gap-2 items-center justify-center`}
            >
              <FaDownload />
              <p>Download File</p>
            </button>
          </div>
          {!isApplicant && comments && (
            <div className="mt-2">
              <label htmlFor="" className="font-medium text-sm">
                Comment
              </label>
              <textarea
                value={comments.staffComment || ""}
                onChange={(e) =>
                  handleCommentChange("staffComment", e.target.value)
                }
                className="p-2 border rounded-2xl bg-gray-100 outline-none w-full"
                disabled={!setComments}
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex mt-2 p-4 flex-col items-center justify-center w-full h-48 border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl -sm">
          <label
            htmlFor="file-upload-staffAttachment"
            className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
          >
            <div className="text-[#005DE9] w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold">+</span>
            </div>
            {data.staffAttachment ? (
              <div className="text-center">
                <p className="text-xl font-medium text-gray-700">
                  {data.staffAttachment.name}
                </p>
                <p className="text-sm text-gray-500">File selected</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-md text-gray-500">Upload file</p>
                <p className="text-md text-gray-400">or drag and drop</p>
              </div>
            )}
          </label>
          <input
            id="file-upload-staffAttachment"
            name="staffAttachment"
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={(e) =>
              setData(
                "staffAttachment",
                e.target.files && (e.target.files[0] as any),
              )
            }
          />
        </div>
      )}
    </div>
  );
};
