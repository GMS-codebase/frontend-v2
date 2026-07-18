import {
  DELETE_SURVEY_SUCCESS,
  FETCH_SURVEYS_SUCCESS,
  FETCH_SURVEY_RESPONSES_SUCCESS,
  MARK_RESPONSE_REVIEWED_SUCCESS,
  END_SURVEY_SUCCESS,
} from "../actions/SurveyActions";

const initialState = {
  surveys: [],
  responses: [],
  loading: false,
  error: null,
};

const surveysReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_SURVEYS_SUCCESS:
      return {
        ...state,
        surveys: action.payload.surveys,
        loading: false,
      };
    case FETCH_SURVEY_RESPONSES_SUCCESS:
      return {
        ...state,
        responses: action.payload.responses,
        loading: false,
      };
    case DELETE_SURVEY_SUCCESS:
      return {
        ...state,
        surveys: state.surveys.filter(
          (survey: any) => survey.uuid !== action.payload.id
        ),
        loading: false,
      };
    case MARK_RESPONSE_REVIEWED_SUCCESS:
      return {
        ...state,
        responses: state.responses.map((response: any) =>
          response.uuid === action.payload.id
            ? { ...response, reviewed: true }
            : response
        ),
        loading: false,
      };
    case END_SURVEY_SUCCESS:
      return {
        ...state,
        surveys: state.surveys.map((survey: any) =>
          survey.uuid === action.payload.id
            ? { ...survey, status: "ended" }
            : survey
        ),
        loading: false,
      };
    default:
      return state;
  }
};

export default surveysReducer;
