export enum ESurveyStatus {
  DRAFT = "draft",
  ONGOING = "ongoing",
  EXPIRED = "expired",
}

export interface Survey {
  uuid: string;
  id: number;
  name: string;
  questions: string; // JSON string from API's 'qns' field
  expiry_date: string;
  survey_status: ESurveyStatus;
  created_at: string;
  updated_at: string;
  survey_type: string;
  hasSurvey_Started: boolean;
  surveyStartingTime: string;
}

export interface SurveyResponse {
  uuid: string;
  id: number; // Matches API's 'id' field (e.g., 9)
  survey_id: string;
  applicant: string;
  survey: string;
  response: string; // Stringified JSON from API's 'answers' field
  timestamp: Date;
  reviewed: boolean;
  details: {
    email?: string;
    phone?: string;
    address?: string;
    responses?: Array<{
      question: string;
      answer: string;
    }>; // Parsed question-answer pairs
  };
}