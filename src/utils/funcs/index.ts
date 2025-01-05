import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";

// Column Definition Type
export interface ColumnDef<T = any> {
  header: string; // Header to be displayed in the Excel file
  accessorKey: keyof T; // Key to access data from the row
}

// Function to export data to a styled Excel file
export const exportDataToExcel = async <T extends Record<string, any>>(
  fileName: string, // Name of the file to save
  excelData: T[], // Data to be exported
  columns: T[], // Column definitions
): Promise<void> => {
  try {
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    // Define worksheet columns based on the provided column definitions
    worksheet.columns = columns.map((column) => ({
      header: column.header,
      key: column.accessorKey as string,
      width: 20, // Set default column width
    }));

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0070C0" },
      };
    });

    console.log("excel data --> ", excelData);
    console.log("excel columns --> ", columns);
    // Add data rows to the worksheet
    excelData.forEach((row) => {
      const formattedRow: Record<string, any> = {};
      columns.forEach((column) => {
        formattedRow[column.accessorKey] = row[column.accessorKey] || "";
      });
      worksheet.addRow(formattedRow);
    });

    // Apply alternating row styles
    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex > 1) {
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: rowIndex % 2 === 0 ? "FFDAEEF3" : "FFFFFFFF" },
          };
          cell.alignment = { vertical: "middle", horizontal: "left" };
        });
      }
    });

    // Apply borders to all cells
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FFAAAAAA" } },
          left: { style: "thin", color: { argb: "FFAAAAAA" } },
          bottom: { style: "thin", color: { argb: "FFAAAAAA" } },
          right: { style: "thin", color: { argb: "FFAAAAAA" } },
        };
      });
    });

    // Generate Excel buffer and trigger file download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    FileSaver.saveAs(blob, `${fileName}.xlsx`);
  } catch (error) {
    console.error("Error exporting data to Excel:", error);
  }
};