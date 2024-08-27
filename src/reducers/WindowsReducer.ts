import {
  ADD_WINDOW_SUCCESS,
  GET_WINDOWS_ERROR,
  GET_WINDOWS_SUCCESS,
  GET_WINDOWS_LOADING,
  GET_SUB_WINDOWS_ERROR,
  GET_SUB_WINDOWS_SUCCESS,
  GET_SUB_WINDOWS_LOADING,
  UPDATE_WINDOW_SUCCESS,
  DELETE_WINDOW_SUCCESS,
} from "@/actions/WindowsActions";
import { Window } from "@/types";

const initialState = {
  windows: [],
  subWindows: [],
  error: null,
  isError: false,
  loading: false,
  subWindowLoading: false,
  subWindowError: null,
  subWindowIsError: false,
};

type Action = {
  type: string;
  payload: any;
};

export default function WindowsReducer(state = initialState, action: Action) {
  switch (action.type) {
    case GET_WINDOWS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_WINDOWS_SUCCESS:
      return {
        ...state,
        loading: false,
        windows: action.payload,
      };
    case GET_WINDOWS_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        error: action.payload,
      };
    case GET_SUB_WINDOWS_LOADING:
      return {
        ...state,
        subWindowsLoading: true,
      };
    case GET_SUB_WINDOWS_SUCCESS:
      return {
        ...state,
        subWindowsLoading: false,
        subWindows: action.payload,
      };
    case GET_SUB_WINDOWS_ERROR:
      return {
        ...state,
        subWindowIsError: true,
        subWindowsLoading: false,
        subWindowError: action.payload,
      };
    case ADD_WINDOW_SUCCESS:
      return {
        ...state,
        windows: [...state.windows, action.payload],
        error: null,
        isError: false,
        loading: false,
      };
    case UPDATE_WINDOW_SUCCESS:
      return {
        ...state,
        windows: state.windows.map((window: Window) =>
          window.uuid === action.payload.id
            ? { ...window, ...action.payload.data }
            : window,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    case DELETE_WINDOW_SUCCESS:
      return {
        ...state,
        windows: state.windows.filter(
          (window: Window) => window.uuid !== action.payload.id,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    default:
      return state;
  }
}
