import {
  ADD_APPEAL_SUCCESS,
  GET_APPEALS_ERROR,
  GET_APPEALS_SUCCESS,
  GET_APPEALS_LOADING,
  UPDATE_APPEAL_SUCCESS,
  DELETE_APPEAL_SUCCESS,
} from "@/actions/AppealsActions";

const initialState = {
  appeals: [],
  error: null,
  isError: false,
  loading: true,
};

type Action = {
  type: string;
  payload: any;
};

export default function AppealsReducer(state = initialState, action: Action) {
  switch (action.type) {
    case GET_APPEALS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_APPEALS_SUCCESS:
      return {
        ...state,
        loading: false,
        appeals: action.payload,
      };
    case GET_APPEALS_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        error: action.payload,
      };
    case ADD_APPEAL_SUCCESS:
      return {
        ...state,
        appeals: [...state.appeals, action.payload],
        error: null,
        isError: false,
        loading: false,
      };
    case UPDATE_APPEAL_SUCCESS:
      return {
        ...state,
        appeals: state.appeals.map((appeal: any) =>
          appeal.uuid === action.payload.uuid
            ? { ...appeal, ...action.payload.data }
            : appeal,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    case DELETE_APPEAL_SUCCESS:
      return {
        ...state,
        appeals: state.appeals.filter(
          (appeal: any) => appeal.uuid !== action.payload.id,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    default:
      return state;
  }
}
