import { Question } from "@/types/questions-form";
import { authorizedApi } from "@/utils/api";
import { handleDownloadFile, handleViewFile } from "@/services";
import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";

type FileInputProps = {
  question: Question;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  disabled?: boolean;
  mode?: "creating" | "viewing" | "answering" | "commenting";
};

const FileInput: React.FC<FileInputProps> = ({
  question,
  value,
  onChange,
  accept = ".pdf",
  disabled = false,
  mode = "creating",
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (files: FileList | null) => {
    if (!files || disabled) return;

    const file = files[0];
    setSelectedFile(file);

    setIsUploading(true);

    if (value) {
      try {
        await authorizedApi.delete("/files/delete", {
          data: {
            folder: question.id,
            filename: value,
          },
        });
      } catch (error) {
        console.warn("Failed to delete the file, proceeding anyway:", error);
      }
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", question.id);
      const response = await authorizedApi.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onChange(response.data.data.data);
    } catch (error) {
      console.error("File upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  if ((mode === "commenting" || mode === "viewing") && value) {
    return (
      <div className="grid grid-cols-2 gap-2 my-2">
        <button
          onClick={() => handleViewFile(value as any, question.id)}
          className={`bg-gray-200  text-black font-semibold rounded-full w-full py-2 flex gap-2 items-center justify-center`}
        >
          View File
        </button>
        <button
          onClick={() => handleDownloadFile(value, question.id)}
          className={` bg-primary  text-white font-semibold rounded-full w-full py-2 flex gap-2 items-center justify-center`}
        >
          <FaDownload />
          <p>Download File</p>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex mt-2 p-4 flex-col items-center justify-center w-full min-h-48 border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <label
        htmlFor="file-upload"
        className={`flex flex-col items-center justify-center space-y-2 cursor-pointer ${disabled ? "pointer-events-none" : ""}`}
      >
        <div className="text-[#005DE9] w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
          <span className="text-2xl font-bold">+</span>
        </div>
        {(selectedFile || value) && (
          <div className="mt-4 bg-gray-200 text-black font-semibold rounded-full px-4 py-2">
            Select Another File
          </div>
        )}
        {selectedFile || value ? (
          <div className="text-center">
            <p className="text-xl font-medium text-gray-700">
              {selectedFile
                ? selectedFile?.name
                : value && typeof value === "string" && value.split("/").pop()}
            </p>
            <p className="text-sm text-gray-500">
              {isUploading ? "Uploading..." : "File selected"}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-md text-gray-500">Upload file</p>
            <p className="text-md text-gray-400">or drag and drop</p>
          </div>
        )}
      </label>
      {(selectedFile || value) && (
        <button
          onClick={() => handleViewFile(value as any, question.id)}
          className={`bg-gray-200 px-5  text-black font-semibold rounded-full w-fit py-2 flex gap-2 items-center justify-center`}
        >
          View Current Selected File
        </button>
      )}
      <input
        id="file-upload"
        type="file"
        accept={accept}
        disabled={disabled}
        style={{ display: "none" }}
        onChange={(e) => handleFileChange(e.target.files)}
      />
    </div>
  );
};

export default FileInput;
