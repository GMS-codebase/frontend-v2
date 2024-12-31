import * as FileSaver from "file-saver"
import * as XLSX from "xlsx";
export default function capitalize(str: string): string {
  console.log(str, str?.charAt(0)?.toUpperCase() + str?.slice(1));
  return str ? str?.charAt(0)?.toUpperCase() + str?.slice(1) : "";
}

export const exportDataToExcel = async (
  fileName: string,
  excelData: any,
  fileExtension: string,
  fileType: any,
) => {
  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};