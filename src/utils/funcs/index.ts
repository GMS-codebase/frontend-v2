import ExcelJS from "exceljs";
import * as FileSaver from "file-saver";
export interface ColumnDef<T = any> {
  header: string;
  accessorKey: keyof T;
}
type ReportType =
  | "Submission Report"
  | "Evaluation Report"
  | "Due Diligence Report"
  | "Grant Committee Report";
export const capitalize = (str: string): string => {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
};

export const getFinalDecisionFromDecisionsArray = (decisions: any[]) => {
  let numberOfApprovals = 0;
  let numberOfRejections = 0;
  if (!decisions) return null;
  for (const decision of decisions) {
    if (decision?.decision?.toLowerCase() === "approved") {
      numberOfApprovals += 1;
    } else if (decision.decision?.toLowerCase() === "rejected") {
      numberOfRejections += 1;
    }
  }

  if (numberOfApprovals > numberOfRejections) {
    return "APPROVED";
  } else {
    return "REJECTED";
  }
};
export const filterByStep = (app: any, step: string): boolean => {
  if (
    step.toLowerCase() === "pending" &&
    app.currentStage === "EVALUATION" &&
    app?.evaluationDecisions?.length < 3
  ) {
    return true;
  } else if (
    step.toLowerCase() === "evaluated" &&
    app.currentStage === "EVALUATION" &&
    app?.evaluationDecisions?.length == 3
  ) {
    return true;
  } else if (
    step.toLowerCase() === "rejected" &&
    app.currentStage === "EVALUATION" &&
    app?.evaluationDecisions?.length == 3 &&
    getFinalDecisionFromDecisionsArray(app?.evaluationDecisions) === "REJECTED"
  ) {
    return true;
  } else if (
    step.toLowerCase() === "approved" &&
    app.currentStage === "EVALUATION" &&
    app?.evaluationDecisions?.length == 3 &&
    getFinalDecisionFromDecisionsArray(app?.evaluationDecisions) === "APPROVED"
  ) {
    return true;
  } else if (
    step.toLowerCase() === "pending" &&
    app.currentStage === "DUE_DILIGENCE" &&
    !app.dueFinalDecision!
  ) {
    return true;
  } else if (
    step.toLowerCase() === "evaluated" &&
    app.currentStage === "DUE_DILIGENCE" &&
    app.dueFinalDecision!
  ) {
    return true;
  } else if (
    step.toLowerCase() === "rejected" &&
    app.currentStage === "DUE_DILIGENCE" &&
    getFinalDecisionFromDecisionsArray(app.duediligencyDecisions) === "REJECTED"
  ) {
    return true;
  } else if (
    step.toLowerCase() === "approved" &&
    app.currentStage === "DUE_DILIGENCE" &&
    getFinalDecisionFromDecisionsArray(app.duediligencyDecisions) === "APPROVED"
  ) {
    return true;
  } else {
    return false;
  }
};
export const getStage = (type: ReportType) => {
  return type == "Submission Report"
    ? "SUBMITTED"
    : type == "Evaluation Report"
      ? "EVALUATION"
      : type == "Due Diligence Report"
        ? "DUE_DILIGENCE"
        : "GRANT_COMMITTEE";
};
export function calculateTotalTrainees(data: any) {
  let totalTrainees = 0;
  for (const key in data) {
    const value = data[key];
    if (
      Array.isArray(value) &&
      value.some(
        (item) => "Number of trainees" in item || "Number of Trainees" in item
      )
    ) {
      totalTrainees = value.reduce(
        (total, item) =>
          total +
          parseInt(
            item["Number of trainees"]
              ? item["Number of trainees"]
              : item["Number of Trainees"]
                ? item["Number of Trainees"]
                : 0,
            10
          ),
        0
      );
      break;
    }
  }

  return totalTrainees;
}
export const exportDataToExcel = async <T extends Record<string, any>>(
  fileName: string,
  excelData: T[],
  columns: T[]
): Promise<void> => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    worksheet.columns = columns
      .filter((column) => column.accessorKey.toLowerCase() !== "actions")
      .map((column) => ({
        header: column.header,
        key: column.accessorKey,
        width: 20, // default column width
      }));

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { name: "Poppins", bold: true, color: { argb: "FFFFFFFF" } }; // Set font to Poppins
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0070C0" },
      };
    });

    excelData.forEach((row) => {
      const formattedRow: Record<string, any> = {};
      columns.forEach((column) => {
        if (column.accessorKey?.toLowerCase() !== "actions") {
          formattedRow[column.accessorKey] = row[column.accessorKey];
        }
      });
      worksheet.addRow(formattedRow);
    });

    worksheet.eachRow((row, rowIndex) => {
      row.eachCell((cell) => {
        cell.font = { name: "Poppins", color: { argb: "FF000000" } };
        if (rowIndex > 1) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: rowIndex % 2 === 0 ? "FFDAEEF3" : "FFFFFFFF" },
          };
          cell.alignment = { vertical: "middle", horizontal: "left" };
        }
      });
    });

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

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    FileSaver.saveAs(blob, `${fileName}.xlsx`);
  } catch (error) {
    console.error("Error exporting data to Excel:", error);
  }
};
