import { ESurveyStatus } from "@/types/surveys-form";

// Define all TypeScript interfaces for the survey management system

export interface Survey {
  uuid: string
  id: number
  name: string
  questions: string
  expiry_date: string
  survey_status: ESurveyStatus
  created_at: string
  updated_at: string
  survey_type: string
  hasSurvey_Started: boolean
  surveyStartingTime: string | null
  // Legacy fields for backward compatibility
  applicants?: number
  status?: "ongoing" | "ended" | "draft"
}

export interface SurveyResponse {
  uuid: string
  applicant: string
  survey: string
  survey_id: string
  timestamp: Date
  response: string
  reviewed: boolean
}

export interface EndSurveyModalProps {
  isOpenModal: boolean
  closeModal: () => void
  survey: Survey | null
}

export interface DataTableProps {
  columns: any[]
  data: any[]
  loading: boolean
  noDataMessage: string
  pageSize?: number
  loadingColor?: string
  loadingBackgroundColor?: string
}
