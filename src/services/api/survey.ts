import { authorizedApi } from "@/utils/api";

export interface SurveySubmission {
  surveyId: number;
  userId: string;
  userName: string;
  answers: string;
}

export type ApplicantApplicationInfo  = {
  uuid: string;
  title: string;
  status: string;
  subWindows: {
    uuid: string;
    title: string;
    status: string;
    sectors: {
      uuid: string;
      name: string;
      status: string;
      trades: {
        uuid: string;
        trade: {
          title: string;
          status: string;
        };
      }[];
    }[];
  }[];
}[]

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

export const getApplicantApplicationsInfo = async (applicantId?: string): Promise<ApplicantApplicationInfo> => {
  try {
    let response;
    
    if (applicantId) {
      // If applicantId is provided (admin/SDF user), pass it in request body
      response = await authorizedApi.get("/survey/get-applicant-applications-info", {
        params: { applicantId }
      });
    } else {
      // If no applicantId (regular applicant user), use GET request
      response = await authorizedApi.get("/survey/get-applicant-applications-info");
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
}; 