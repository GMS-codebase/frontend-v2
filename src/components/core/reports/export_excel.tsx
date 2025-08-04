import React from "react";
import * as XLSX from "xlsx";
import { FiDownload } from "react-icons/fi";

interface ExportExcelProps {
  excelData: string[][];
  fileName: string;
}

const ExportExcel: React.FC<ExportExcelProps> = ({ excelData, fileName }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName + fileExtension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={exportToExcel}
      className="text-white py-2.5 px-6 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap"
      style={{
        background:
          "linear-gradient(84.73deg, #005DE9 10.01%, #0546A8 114.53%)",
      }}
    >
      <span className="text-xl">
        <FiDownload />
      </span>
      <span className="text-base font-medium">Download All Responses</span>
    </button>
  );
};

export default ExportExcel;
