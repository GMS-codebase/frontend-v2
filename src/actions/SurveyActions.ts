// Survey action types
export const DELETE_SURVEY_SUCCESS = "DELETE_SURVEY_SUCCESS";
export const FETCH_SURVEYS_SUCCESS = "FETCH_SURVEYS_SUCCESS";
export const FETCH_SURVEY_RESPONSES_SUCCESS = "FETCH_SURVEY_RESPONSES_SUCCESS";
export const MARK_RESPONSE_REVIEWED_SUCCESS = "MARK_RESPONSE_REVIEWED_SUCCESS";
export const END_SURVEY_SUCCESS = "END_SURVEY_SUCCESS";

// Action creators
export const deleteSurveySuccess = (id: string) => ({
  type: DELETE_SURVEY_SUCCESS,
  payload: { id },
});

export const fetchSurveysSuccess = (surveys: any[]) => ({
  type: FETCH_SURVEYS_SUCCESS,
  payload: { surveys },
});

export const fetchSurveyResponsesSuccess = (responses: any[]) => ({
  type: FETCH_SURVEY_RESPONSES_SUCCESS,
  payload: { responses },
});

export const markResponseReviewedSuccess = (id: string) => ({
  type: MARK_RESPONSE_REVIEWED_SUCCESS,
  payload: { id },
});

export const endSurveySuccess = (id: string) => ({
  type: END_SURVEY_SUCCESS,
  payload: { id },
});
