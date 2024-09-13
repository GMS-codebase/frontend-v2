export type Route = {
  label: string;
  path: string;
  icon: any;
};

export type Window = {
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
export type Sector = {
  title: string;
  description: string;
  uuid: string;
  trades: Trade[];
};

export type ReduxState = {
  // applications:A;
};

export type Application = {
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

export type Comments = {
  titleComment: string;
  activitiesComment: string;
  readinessExecuteComment: string;
  roleComment: string;
  institutionComment: string;
  trainingManualComment: string;
  trainingEquipmentComment: string;
  identificationEmployeeComment: string;
  staffComment: string;
  sustainabilityComment: string;
  previousFinancialReportComment: string;
  trainingPremisesComment: string;
  contributionFromApplicantComment: string;
  recruitmentTrainerComment: string;
  MOUsAttachmentComment: string;
  identificationMemberComment: string;
  assessmentEquipmentComment: string;
  recruitmentCandidatesNumberComment: string;
  assessorsAndFacilitatorsComment: string;
  budgetAttachmentComment: string;
  contributionComment: string;
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
  subWindows: SubWindow[] | string[];
  sectors: Sector[] | string[];
  attachment: File | string | null;
};
