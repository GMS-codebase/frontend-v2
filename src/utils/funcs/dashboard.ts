import { getApplicationStatus } from "@/services";

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
      const stage = application.currentStage;

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
  applications: Application[]
): SubmissionsData => {
  console.log("Here");
  const submissionsData: SubmissionsData = {};

  applications
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
// Function to get applicants data (count of distinct applicants per sector)
export const getApplicantsData = (
  applications: Application[]
): ApplicantsData => {
  const applicantsData: any = {};

  applications.forEach((application) => {
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

// Function to get applications data (count of applications per sector)
export const getApplicationsData = (
  applications: Application[]
): ApplicationsData => {
  console.log("Here");
  const applicationsData: ApplicationsData = {};

  applications.forEach((application) => {
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
