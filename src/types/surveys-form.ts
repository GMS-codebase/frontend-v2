export enum ESurveyStatus {
  ONGOING = 'ONGOING',
  EXPIRED = 'EXPIRED', 
  DRAFT = 'DRAFT'
}

export enum ESurveyType {
  TRAINEESURVEY = 'TRAINEESURVEY',
  COMPANYSURVEY = 'COMPANYSURVEY',
  GENERALSURVEY = 'GENERALSURVEY'
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
