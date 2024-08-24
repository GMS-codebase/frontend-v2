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
export type Trade = {
  title: string;
  description: string;
  uuid: string;
};
export type Sector = {
  title: string;
  description: string;
  uuid: string;
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
