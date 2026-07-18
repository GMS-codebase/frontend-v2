import {
  ADD_STAGE_SUCCESS,
  GET_STAGES_ERROR,
  GET_STAGES_SUCCESS,
  GET_STAGES_LOADING,
  UPDATE_STAGE_SUCCESS,
  DELETE_STAGE_SUCCESS,
} from "@/actions/EmpStagesActions";
import { Window } from "@/types";

const initialState = {
  stages: [],
  error: null,
  isError: false,
  loading: true,
};

type Action = {
  type: string;
  payload: any;
};

export default function EmpStagesReducer(state = initialState, action: Action) {
  switch (action.type) {
    case GET_STAGES_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_STAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        stages: action.payload,
      };
    case GET_STAGES_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        error: action.payload,
      };
    case ADD_STAGE_SUCCESS:
      return {
        ...state,
        stages: [...state.stages, action.payload],
        error: null,
        isError: false,
        loading: false,
      };
    case UPDATE_STAGE_SUCCESS:
      return {
        ...state,
        stages: state.stages.map((stage: Window) =>
          stage.uuid === action.payload.id
            ? { ...stage, ...action.payload.data }
            : stage,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    case DELETE_STAGE_SUCCESS:
      return {
        ...state,
        stages: state.stages.filter(
          (stage: Window) => stage.uuid !== action.payload.id,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    default:
      return state;
  }
}
