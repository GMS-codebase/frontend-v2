import React from "react";
import { FileText, FileSpreadsheet, Download } from "lucide-react";
import { BsFilePdf, BsFileWord } from "react-icons/bs";
import { handleDownloadFile } from "@/services";

type Props = {
  filePath: string;
};

function getFileTypeIcon(ext: string) {
  switch (ext) {
    case "pdf":
      return <BsFilePdf className="text-red-500" size={32} />;
    case "doc":
    case "docx":
      return <BsFileWord className="text-blue-500" size={32} />;
    case "xls":
    case "xlsx":
      return <FileSpreadsheet className="text-green-500" size={32} />;
    default:
      return <FileText className="text-gray-500" size={32} />;
  }
}

function getCleanFileName(filePath: string) {
  // Extract file name from path
  const fileName = filePath?.split("/").pop() || "";

  // Separate name and extension
  const match = fileName.match(/^(.*?)(-[a-f0-9\-]{36})?\.(\w+)$/);

  if (match) {
    const baseName = match[1];
    const ext = match[3];
    return `${baseName}.${ext}`;
  }

  return fileName;
}

const TrainingManualCard: React.FC<Props> = ({ filePath }) => {
  const ext = filePath?.split(".").pop()?.toLowerCase() || "";
  const cleanName = getCleanFileName(filePath);

  const onDownload = () => {
    handleDownloadFile(filePath, "training");
  };
  return (
    <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md p-6 flex items-center gap-4 border border-gray-200">
      <div className="flex-shrink-0">{getFileTypeIcon(ext)}</div>
      <div className="flex-1">
        <div className="font-semibold text-lg text-primaryText">
          {cleanName}
        </div>
        <div className="text-sm text-gray-500">{ext?.toUpperCase()} file</div>
      </div>
      <button
        className="absolute top-4 right-4 bg-primary text-white rounded-full p-2 shadow hover:bg-primary/90 transition"
        onClick={onDownload}
        title="Download training manual"
      >
        <Download size={20} />
      </button>
    </div>
  );
};

export default TrainingManualCard;
