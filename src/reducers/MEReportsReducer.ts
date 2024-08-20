import {
  ADD_MEREPORT_SUCCESS,
  GET_MEREPORTS_ERROR,
  GET_MEREPORTS_SUCCESS,
  GET_MEREPORTS_LOADING,
  UPDATE_MEREPORT_SUCCESS,
  DELETE_MEREPORT_SUCCESS,
} from "@/actions/MEReportsActions";
import { Window } from "@/types";

const initialState = {
  mereports: [],
  error: null,
  isError: false,
  loading: false,
};

type Action = {
  type: string;
  payload: any;
};

export default function MEReportsReducer(state = initialState, action: Action) {
  switch (action.type) {
    case GET_MEREPORTS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_MEREPORTS_SUCCESS:
      return {
        ...state,
        loading: false,
        mereports: action.payload,
      };
    case GET_MEREPORTS_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        error: action.payload,
      };
    case ADD_MEREPORT_SUCCESS:
      return {
        ...state,
        mereports: [...state.mereports, action.payload],
        error: null,
        isError: false,
        loading: false,
      };
    case UPDATE_MEREPORT_SUCCESS:
      return {
        ...state,
        mereports: state.mereports.map((mereport: Window) =>
          mereport.uuid === action.payload.id
            ? { ...mereport, ...action.payload.data }
            : mereport,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    case DELETE_MEREPORT_SUCCESS:
      return {
        ...state,
        mereports: state.mereports.filter(
          (mereport: Window) => mereport.uuid !== action.payload.id,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    default:
      return state;
  }
}
