import { authorizedApi } from "@/utils/api";

export interface SurveySubmission {
  surveyId: number;
  userId: string;
  userName: string;
  answers: string;
}

export const submitSurvey = async (data: SurveySubmission) => {
  try {
    const response = await authorizedApi.post("/survey/submit-survey", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkSurveyStatus = async (surveyId: number, userId: string) => {
  try {
    const response = await authorizedApi.get(`/survey/status/${surveyId}/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 