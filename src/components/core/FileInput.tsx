import { authorizedApi } from "@/utils/api";
import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";

type FileInputProps = {
  value?: string | string[];
  onChange: (url: string | string[]) => void;
  multi?: boolean;
  accept?: string;
  disabled?: boolean;
  mode?: "creating" | "viewing" | "answering" | "commenting";
  answers?: string;
  handleViewFile?: (url: string, type: string) => void;
  handleDownloadFile?: (url: string, type: string) => void;
};

const FileInput: React.FC<FileInputProps> = ({
  value,
  onChange,
  multi = false,
  accept = ".pdf",
  disabled = false,
  mode = "creating",
  answers,
  handleViewFile,
  handleDownloadFile,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (files: FileList | null) => {
    if (!files || disabled) return;

    const filesArray = Array.from(files);
    setSelectedFiles(filesArray);

    setIsUploading(true);
    try {
      const uploadedUrls = await Promise.all(
        filesArray.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const response = await authorizedApi.post("/files/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          return response.data.url;
        })
      );
      onChange(multi ? uploadedUrls : uploadedUrls[0]);
    } catch (error) {
      console.error("File upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  if ((mode === "commenting" || mode === "viewing") && answers) {
    return (
      <div className="grid grid-cols-2 gap-2 my-2">
        <button
          onClick={() => handleViewFile && handleViewFile(answers, "applications")}
          className={`bg-gray-200 text-black font-semibold rounded-full w-full py-2 flex gap-2 items-center justify-center`}
        >
          View File
        </button>
        <button
          onClick={() => handleDownloadFile && handleDownloadFile(answers, "applications")}
          className={`bg-primary text-white font-semibold rounded-full w-full py-2 flex gap-2 items-center justify-center`}
        >
          <FaDownload />
          <p>Download File</p>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex mt-2 p-4 flex-col items-center justify-center w-full h-48 border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <label
        htmlFor="file-upload"
        className={`flex flex-col items-center justify-center space-y-2 cursor-pointer ${disabled ? "pointer-events-none" : ""}`}
      >
        <div className="text-[#005DE9] w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
          <span className="text-2xl font-bold">+</span>
        </div>
        {selectedFiles.length > 0 || value ? (
          <div className="text-center">
            {(multi ? selectedFiles : selectedFiles.slice(0, 1)).map((file, index) => (
              <p key={index} className="text-xl font-medium text-gray-700">
                {file.name}
              </p>
            ))}
            <p className="text-sm text-gray-500">{isUploading ? "Uploading..." : "File selected"}</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-md text-gray-500">Upload file</p>
            <p className="text-md text-gray-400">or drag and drop</p>
          </div>
        )}
      </label>
      <input
        id="file-upload"
        type="file"
        accept={accept}
        multiple={multi}
        disabled={disabled}
        style={{ display: "none" }}
        onChange={(e) => handleFileChange(e.target.files)}
      />
      {(selectedFiles.length > 0 || value) && (
        <button
          onClick={() => setSelectedFiles([])}
          className="mt-4 bg-gray-200 text-black font-semibold rounded-full px-4 py-2"
        >
          Select Another File
        </button>
      )}
    </div>
  );
};

export default FileInput;
