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
  id?: number;
  applicant: {
    // Assuming applicant is an object with a name
    uuid: string;
    name: string;
    [key: string]: any; // Allow other properties
  };
  survey: {
    // Assuming survey is an object with id and name
    id: number;
    name: string;
    qns?: string; // Include qns as it's used in fetchResponses
    survey_TYPE?: string; // Include survey_TYPE
    [key: string]: any; // Allow other properties
  };
  answers: string; // JSON string of answers
  submitted_at: string; // Timestamp string
  reviewed: boolean; // Status of the response
  [key: string]: any; // Allow other properties for the top level
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

export interface Form {
  uuid?: string;
  id?: number;
  name: string;
  qns: SurveyForm | string;
  status?: "ongoing" | "expired";
  created_at: Date | string;
  expiry_date?: Date | string;
  description?: string;
  questions?: SurveyForm | string;
  survey_status?: ESurveyStatus;
  updated_at?: string;
  survey_type?: ESurveyType;
  hasSurvey_Started?: boolean;
  surveyStartingTime?: string | null;
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
