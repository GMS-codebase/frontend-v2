import {
  GET_SURVEY_TRAINEES_ERROR,
  GET_SURVEY_TRAINEES_SUCCESS,
  GET_SURVEY_TRAINEES_LOADING,
  UPDATE_SURVEY_TRAINEE_SUCCESS,
  DELETE_SURVEY_TRAINEE_SUCCESS,
  ADD_SURVEY_TRAINEE_SUCCESS,
} from "@/actions/SurveyTraineeActions";
import { Trade } from "@/types";

const initialState = {
  surveyTrainees: [],
  error: null,
  isError: false,
  loading: true,
};

type Action = {
  type: string;
  payload: any;
};

export default function SurveyTraineeReducer(
  state = initialState,
  action: Action
) {
  switch (action.type) {
    case GET_SURVEY_TRAINEES_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_SURVEY_TRAINEES_SUCCESS:
      return {
        ...state,
        loading: false,
        surveyTrainees: action.payload,
      };
    case GET_SURVEY_TRAINEES_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        error: action.payload,
      };
    case ADD_SURVEY_TRAINEE_SUCCESS:
      return {
        ...state,
        surveyTrainees: [...state.surveyTrainees, action.payload],
        error: null,
        isError: false,
        loading: false,
      };
    case UPDATE_SURVEY_TRAINEE_SUCCESS:
      return {
        ...state,
        surveyTrainees: state.surveyTrainees?.map((trade: Trade) =>
          trade.uuid == action.payload.uuid
            ? { ...trade, ...action.payload }
            : trade
        ),
        error: null,
        isError: false,
        loading: false,
      };
    case DELETE_SURVEY_TRAINEE_SUCCESS:
      return {
        ...state,
        surveyTrainees: state.surveyTrainees.filter(
          (trade: Trade) => trade.uuid !== action.payload.id
        ),
        error: null,
        isError: false,
        loading: false,
      };
    default:
      return state;
  }
}
