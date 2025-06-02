import { ESurveyStatus } from "@/types/surveys-form";

// Define all TypeScript interfaces for the survey management system

export interface Survey {
  uuid: string;
  id: number;
  name: string;
  questions: string;
  expiry_date: string;
  survey_status: ESurveyStatus;
  created_at: string;
  updated_at: string;
  survey_type: string;
  hasSurvey_Started: boolean;
  surveyStartingTime: string | null;
  // Legacy fields for backward compatibility
  applicants?: number;
  status?: "ongoing" | "ended" | "draft";
}

export interface SurveyResponse {
  uuid: string;
  applicant: {
    uuid: string;
    user_id: string;
    deletedStatus: boolean;
    doneAt: string;
    lastUpdatedAt: string;
    doneBy: string | null;
    lastUpdatedBy: string | null;
    name: string;
    age: number | null;
    gender: string | null;
    address: string | null;
    email: string | null;
    nationalId: string | null;
    phone: string | null;
    description: string | null;
    po_box: string | null;
    has_completed_profile: boolean;
    contact_count: number;
  };
  survey: {
    id: number;
    name: string;
    qns: string;
    description: string;
    expiry_date: string;
    survey_status: string;
    created_at: string;
    updated_at: string;
    survey_TYPE: string;
    hasSurvey_Started: boolean;
    surveyStartingTime: string | null;
  };
  survey_id: string;
  submitted_at: string;
  response: string;
  reviewed: boolean;
  answers: string;
}

export interface EndSurveyModalProps {
  isOpenModal: boolean;
  closeModal: () => void;
  survey: Survey | null;
}

export interface DataTableProps {
  columns: any[];
  data: any[];
  loading: boolean;
  noDataMessage: string;
  pageSize?: number;
  loadingColor?: string;
  loadingBackgroundColor?: string;
}
