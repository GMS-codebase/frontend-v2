export type Route = {
  label: string;
  path: string;
  icon: any;
};

export type BudgetLine = {
  uuid?: string;
  name: string;
  status?: any;
};

export type Form = {
  uuid?: string;
  name: string;
  dto: string;
};

export type Window = {
  subWindows: any;
  title: string;
  description: string;
  uuid: string;
};
export type SubWindow = {
  title: string;
  description: string;
  uuid: string;
};
export type Trade = {
  title: string;
  description: string;
  shortname: string;
  uuid: string;
};
export type TradeSector = {
  trade: Trade;
  sector: Sector;
  theWindow: Window;
  uuid: string;
};
export type Sector = {
  name: string;
  description: string;
  uuid: string;
  trades: Trade[];
};

export type ReduxState = {
  applications: any;
};

export type Application = {
  uuid: string;
};

export type Applicant = {
  uuid: string;
};

export type Contract = {
  uuid: string;
  contractNumber: number;
};

export type Contact = {
  uuid: string;
  firstName: string;
  lastName: string;
  mobile: string;
  mobile1: string;
  position: string;
  gender: string;
  email: string;
};

export type Training = {
  uuid: string;
  title: string;
  startDate: string;
  endDate: string;
  materialFile: any;
  traineesFile: any;
  status: "rejected" | "accepted" | "draft";
};

export type Comments = {
  titleComment: string;
  activitiesComment: string;
  readinessExecuteComment: string;
  roleComment: string;
  institutionComment: string;
  trainingManualComment: string;
  trainingEquipmentComment: string;
  premisesAttachmentComment: string;
  identificationEmployeeComment: string;
  staffComment: string;
  sustainabilityComment: string;
  previousFinancialReportComment: string;
  trainingPremisesComment: string;
  assessmentComment: string;
  contributionFromApplicantComment: string;
  recruitmentTrainerComment: string;
  MOUsAttachmentComment: string;
  identificationMemberComment: string;
  assessmentEquipmentComment: string;
  recruitmentCandidatesNumberComment: string;
  assessorsAndFacilitatorsComment: string;
  budgetSummaryAttachmentComment: string;
  contributionComment?: string;
  budgetLinesComment?: string;
  trainingProcessComment?: string;
  assessmentProcessComment?: string;
};

export type Call = {
  uuid: string;
  title: string;
  status: "OPEN" | "CLOSED";
  startDate: string;
  endDate: string;
  description: string;
  appealDays: string;
  windows: Window[] | string[];
  form: Form | string;
  subwindowForms: string;
  sectors: Sector[] | string[];
  attachment: File | string | null;
};

export type TrainingData = {
    uuid: string;
    title: string;
    Applicant: string;
    Call: string;
    status: "REJECTED" | "ACCEPTED" | "UNDER REVIEW";
};