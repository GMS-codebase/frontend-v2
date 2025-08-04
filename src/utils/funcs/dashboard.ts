import { getApplicationStatus } from "@/services";
import * as XLSX from "xlsx";
import { authorizedApi } from "../api";

type GenderCount = {
  male: number;
  female: number;
  [key: string]: number; // Allow any string key for future flexibility
};

type businessTypeGroupings = {
  [key: string]: {
    [key: string]: number;
  };
};

type ApplicantsPerSector = {
  [sector: string]: number;
};

type SubmissionsData = {
  [sector: string]: {
    applicants: number;
    applications: number;
  };
};

type ApplicantsData = {
  [sector: string]: number; // The value is a number, but the key is a string
};

type ApplicationsData = {
  [sector: string]: number; // Count of applications made in the sector
};

type Application = {
  uuid: string;
  currentStage: string;
  call: {
    uuid: string;
  };
  applicant: {
    gender: string;
    businesses: {
      businessType: string;
    }[];
    uuid: string; // Add uuid for applicant identification
  };
  sectors: {
    name: string;
  }[];
};

type Call = {
  uuid: string;
  applications: Application[];
};

export const getCallStats = async (callId: string) => {
  try {
    const res = await authorizedApi.get(`/dashboard/call/${callId}/stats`);
    return res.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getSubmissionsData = async (stage: string) => {
  try {
    const res = await authorizedApi.get(`/dashboard/submissions`, {
      params: { stage },
    });
    return res.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getApplicantsData = async (stage: string) => {
  try {
    const res = await authorizedApi.get(`/dashboard/applicants`, {
      params: { stage },
    });
    return res.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getApplicationsData = async (stage: string) => {
  try {
    const res = await authorizedApi.get(`/dashboard/applications`, {
      params: { stage },
    });
    return res.data.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export const exportToExcel = (
  data: Record<string, any[]>,
  fileName: string = "data.xlsx",
): void => {
  if (!data || typeof data !== "object") {
    console.error("Invalid data provided for export");
    return;
  }

  const workbook = XLSX.utils.book_new();

  Object.keys(data).forEach((sheetName) => {
    const sheetData = data[sheetName];

    if (Array.isArray(sheetData)) {
      const worksheet = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    } else {
      console.warn(`Skipping invalid sheet data for sheet: ${sheetName}`);
    }
  });

  XLSX.writeFile(workbook, fileName);
};

export const downloadDashboardExcelFile = (
  applicationsData?: ApplicationsData,
  applicantsData?: ApplicantsData,
  submissionsData?: SubmissionsData,
): void => {
  const data: Record<string, any[]> = {};

  if (applicationsData) {
    data["Applications Data"] = Object.entries(applicationsData).map(
      ([sector, count]) => ({
        Sector: sector,
        Applications: count,
      }),
    );
  }

  if (applicantsData) {
    data["Applicants Data"] = Object.entries(applicantsData).map(
      ([sector, count]) => ({
        Sector: sector,
        Applicants: count,
      }),
    );
  }

  if (submissionsData) {
    data["Submissions Data"] = Object.entries(submissionsData).map(
      ([sector, details]) => ({
        Sector: sector,
        Applications: details.applications,
        Applicants: details.applicants,
      }),
    );
  }

  exportToExcel(data, "exported_data.xlsx");
};
