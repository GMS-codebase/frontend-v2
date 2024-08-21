import {
  ADD_APPLICATION_SUCCESS,
  GET_APPLICATIONS_ERROR,
  GET_APPLICATIONS_SUCCESS,
  GET_APPLICATIONS_LOADING,
  UPDATE_APPLICATION_SUCCESS,
  DELETE_APPLICATION_SUCCESS,
} from "@/actions/ApplicationsActions";
import { Window } from "@/types";

const initialState = {
  applications: [],
  error: null,
  isError: false,
  loading: false,
};

type Action = {
  type: string;
  payload: any;
};

export default function ApplicationsReducer(
  state = initialState,
  action: Action,
) {
  switch (action.type) {
    case GET_APPLICATIONS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_APPLICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        applications: action.payload,
      };
    case GET_APPLICATIONS_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        error: action.payload,
      };
    case ADD_APPLICATION_SUCCESS:
      return {
        ...state,
        applications: [...state.applications, action.payload],
        error: null,
        isError: false,
        loading: false,
      };
    case UPDATE_APPLICATION_SUCCESS:
      return {
        ...state,
        applications: state.applications.map((application: Window) =>
          application.uuid === action.payload.id
            ? { ...application, ...action.payload.data }
            : application,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    case DELETE_APPLICATION_SUCCESS:
      return {
        ...state,
        applications: state.applications.filter(
          (application: Window) => application.uuid !== action.payload.id,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    default:
      return state;
  }
}
