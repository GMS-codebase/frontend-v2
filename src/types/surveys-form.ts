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
  applicant: {
    uuid: string;
    user_id: string;
    [key: string]: any;
  };
  trainee: any;
  reviewed: boolean;
  [key: string]: any;
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
  qns: any;
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
  columns?: TableColumn[];
  choices?: string[];
  template?: string;
}

export interface TableColumn {
  title: string;
  type: "text" | "number" | "select" | "date";
  options?: string[];
}
