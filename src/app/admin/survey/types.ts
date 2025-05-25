// Define all TypeScript interfaces for the survey management system

export interface Survey {
  uuid: string
  name: string
  applicants: number
  status: "ongoing" | "ended" | "draft"
  created_at: Date
  expiry_date: Date
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
