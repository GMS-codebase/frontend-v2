import { getApplicationStatus } from "@/services";
import * as XLSX from "xlsx";

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

export const getCallStats = (
  callId: string,
  applications: Application[]
): {
  genderCount: GenderCount;
  businessTypeGroupings: businessTypeGroupings;
  applicantsPerSector: ApplicantsPerSector;
} => {
  const genderCount: GenderCount = { male: 0, female: 0 };
  const businessTypeGroupings: businessTypeGroupings = {};
  const applicantsPerSector: ApplicantsPerSector = {};
  const applicantsData: any = {};

  applications
    .filter((app) => app.call.uuid === callId)
    .map((application) => {
      const gender = application.applicant.gender;
      const stage = getApplicationStatus(application);

      // Gender count
      if (gender.toLowerCase() === "male") {
        genderCount.male++;
      } else if (gender.toLowerCase() === "female") {
        genderCount.female++;
      }

      // Business type grouping
      const businessType = application.applicant.businesses[0]?.businessType;
      if (businessType) {
        if (!businessTypeGroupings[businessType]) {
          businessTypeGroupings[businessType] = {};
        }

        if (!businessTypeGroupings[businessType][stage]) {
          businessTypeGroupings[businessType][stage] = 0;
        }

        businessTypeGroupings[businessType][stage]++;
      }

      // Sector count
      application.sectors.forEach((sector) => {
        const sectorName = sector.name;

        if (!applicantsData[sectorName]) {
          applicantsData[sectorName] = {
            applicants: 0, // Initialize the count of applicants
            applicantUuids: new Set<string>(), // Track unique applicant UUIDs
          };
        }

        const applicantUuid = application.applicant.uuid;

        // Check if the applicant has already applied to this sector
        if (!applicantsData[sectorName].applicantUuids.has(applicantUuid)) {
          applicantsData[sectorName].applicantUuids.add(applicantUuid); // Add to set to ensure uniqueness
          applicantsData[sectorName].applicants++; // Increase the count for this sector
        }
        if (!applicantsPerSector[sector.name]) {
          applicantsPerSector[sector.name] = 0;
        }
        applicantsPerSector[sector.name]++;
      });
    });

  const finalApplicantsData: ApplicantsData = {};
  Object.keys(applicantsData).forEach((sectorName) => {
    finalApplicantsData[sectorName] = applicantsData[sectorName].applicants;
  });

  return {
    genderCount,
    businessTypeGroupings,
    applicantsPerSector: finalApplicantsData,
  };
};

// Function to get submissions data (count of applicants and applications per sector)
export const getSubmissionsData = (
  applications: Application[],
  stage: string
): SubmissionsData => {
  const submissionsData: SubmissionsData = {};

  applications
    .filter((app) => stage === "ALL" || getApplicationStatus(app) === stage)
    .filter((app) => getApplicationStatus(app) !== "ANSWERING")
    .forEach((application) => {
      application.sectors.forEach((sector) => {
        const sectorName = sector.name;

        if (!submissionsData[sectorName]) {
          submissionsData[sectorName] = {
            applicants: 0,
            applications: 0,
          };
        }

        // Count applications for this sector
        submissionsData[sectorName].applications++;

        // Ensure distinct applicants for the sector
        const applicantUuid = application.applicant.uuid;
        //@ts-ignore
        if (!submissionsData[sectorName][applicantUuid]) {
          submissionsData[sectorName].applicants++;
          //@ts-ignore
          submissionsData[sectorName][applicantUuid] = true; // Track distinct applicants
        }
      });
    });

  return submissionsData;
};

export const getApplicantsData = (
  applications: Application[],
  stage: string
): ApplicantsData => {
  const applicantsData: any = {};

  applications
    .filter((app) => stage === "ALL" || getApplicationStatus(app) === stage)
    .forEach((application) => {
      application.sectors.forEach((sector) => {
        const sectorName = sector.name;

        if (!applicantsData[sectorName]) {
          applicantsData[sectorName] = {
            applicants: 0, // Initialize the count of applicants
            applicantUuids: new Set<string>(), // Track unique applicant UUIDs
          };
        }

        const applicantUuid = application.applicant.uuid;

        // Check if the applicant has already applied to this sector
        if (!applicantsData[sectorName].applicantUuids.has(applicantUuid)) {
          applicantsData[sectorName].applicantUuids.add(applicantUuid); // Add to set to ensure uniqueness
          applicantsData[sectorName].applicants++; // Increase the count for this sector
        }
      });
    });

  // Transform applicantsData to return just the count of applicants per sector
  const finalApplicantsData: ApplicantsData = {};
  Object.keys(applicantsData).forEach((sectorName) => {
    finalApplicantsData[sectorName] = applicantsData[sectorName].applicants;
  });

  return finalApplicantsData;
};

export const getApplicationsData = (
  applications: Application[],
  stage: string
): ApplicationsData => {
  const applicationsData: ApplicationsData = {};

  applications
    .filter((app) => stage === "ALL" || getApplicationStatus(app) === stage)
    .forEach((application) => {
      application.sectors.forEach((sector) => {
        const sectorName = sector.name;

        if (!applicationsData[sectorName]) {
          applicationsData[sectorName] = 0;
        }

        // Count applications
        applicationsData[sectorName]++;
      });
    });

  return applicationsData;
};

export const exportToExcel = (
  data: Record<string, any[]>,
  fileName: string = "data.xlsx"
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
  submissionsData?: SubmissionsData
): void => {
  const data: Record<string, any[]> = {};

  if (applicationsData) {
    data["Applications Data"] = Object.entries(applicationsData).map(
      ([sector, count]) => ({
        Sector: sector,
        Applications: count,
      })
    );
  }

  if (applicantsData) {
    data["Applicants Data"] = Object.entries(applicantsData).map(
      ([sector, count]) => ({
        Sector: sector,
        Applicants: count,
      })
    );
  }

  if (submissionsData) {
    data["Submissions Data"] = Object.entries(submissionsData).map(
      ([sector, details]) => ({
        Sector: sector,
        Applications: details.applications,
        Applicants: details.applicants,
      })
    );
  }

  exportToExcel(data, "exported_data.xlsx");
};
