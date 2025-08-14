export enum ESurveyStatus {
  ONGOING = "ONGOING",
  ENDED = "ENDED",
  DRAFT = "DRAFT",
}

export enum ESurveyType {
  TRAINEESURVEY = "TRAINEESURVEY",
  COMPANYSURVEY = "COMPANYSURVEY",
  GENERALSURVEY = "GENERALSURVEY",
}

export interface SurveyResponse {
  uuid: string;
  lastUpdatedAt?: string;
  answers: string;
  status: string;
  submitted_at: string;
  applicant: Applicant | null;
  trainee: Trainee | null;
  reviewed: boolean;
  survey: Survey;
  [key: string]: any;
}

export interface Applicant {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  nationalId?: string;
  user_id?: string;
  age?: number;
  description?: string;
  po_box?: string;
  has_completed_profile?: boolean;
  contact_count?: number;
}

export interface Trainee {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  nationalId: string;
  applicationNumber: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  approvalStatus?: string;
  user_id: string;
}

export interface SurveyForm {
  [key: string]: {
    name: string;
    description: string;
    pages: {
      surveys: Survey[];
    }[];
  };
}

export interface Section {
  name: string;
  description: string;
  questions: Survey[];
}

export interface IForm {
  uuid?: string;
  id?: number;
  name: string;
  qns: SurveyForm;
  questions?: any;
  status?: "ongoing" | "ended" | undefined;
  created_at: Date;
  expiry_date: Date;
  description?: string;
  survey_status?: string;
  updated_at?: Date;
  survey_type?: ESurveyType;
  hasSurvey_Started?: boolean;
  surveyStartingTime?: Date;
  sections?: Section[];
  flag1?: boolean; // Submitted response flag
  flag2?: boolean; // Draft saved flag
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  type:
    | "text"
    | "paragraph"
    | "file"
    | "table"
    | "radio"
    | "checkbox"
    | "select"
    | "multiselect";
  required: boolean;
  commentable: boolean;
  name: string;
  survey_TYPE: string;
  columns?: TableColumn[];
  choices?: string[];
  template?: string;
}

export interface TableColumn {
  title: string;
  type: "text" | "number" | "select" | "date";
  options?: string[];
}
