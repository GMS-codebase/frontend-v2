// interfaces.ts

export interface ApplicationQuestions {
  // Sub Window 1.1
  title?: string;
  activitiesAndOutcomes?: string;
  readinessExecute?: string;
  role?: string;
  institution?: string;
  trainingProcess?: TrainingProcess[];
  trainingEquipment?: TrainingEquipment[];
  identificationEmployee?: string;
  staffs?: Staff[];
  sustainability?: string;
  contributionFromApplicant?: string;

  // Sub Window 1.2
  recruitmentTrainerNumber?: string;

  // Sub Window 2.2

  // Sub Window 2.3

  // Sub Window 3.1
  identificationMember?: string;

  // Sub Window 3.2
  assessmentAndCertificationProcess?: AssessmentAndCertificationProcess[];
  assessmentEquipment?: AssessmentEquipment[];
  recruitmentCandidatesNumber?: string;
  assessorsAndFacilitators?: string;
  contribution?: string;

  // Attachments
  roleAttachment?: File;
  institutionAttachment?: File;
  trainingManualAttachment?: File;
  trainingEquipmentAttachment?: File;
  previousFinancialReportAttachment?: File;
  MOUsAttachment?: File[];
  assessmentEquipmentAttachment?: File;
  budgetSummaryAttachment?: File;
}

export interface AssessmentAndCertificationProcess {
  moduleName: string;
  from: Date;
  to: Date;
  numberOfHours: number;
  trade: string;
}

export interface Staff {
  number: string;
  position: string;
  qualification: string;
  available: AvailableOrHired;
}

export interface TrainingEquipment {
  nameOfEquipment: string;
  numberOfEquipment: string;
  trade: string;
}

export interface TrainingProcess {
  moduleName: string;
  from: Date;
  to: Date;
  numberOfHours: number;
  trade: string;
}

export interface AssessmentEquipment {
  nameOfEquipment: string;
  numberOfEquipment: string;
  trade: string;
}

// Enum for Staff availability
export enum AvailableOrHired {
  AVAILABLE = "AVAILABLE",
  HIRED = "To be hired",
}
