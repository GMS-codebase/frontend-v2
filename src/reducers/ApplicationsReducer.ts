import {
  GET_APPLICATIONS_SUCCESS,
  GET_APPLICATIONS_ERROR,
  ADD_APPLICATION_SUCCESS,
  UPDATE_APPLICATION_SUCCESS,
  DELETE_APPLICATION_SUCCESS,
  GET_APPLICATIONS_LOADING,
  GET_MY_APPLICATIONS_LOADING,
  GET_MY_APPLICATIONS_SUCCESS,
  GET_MY_APPLICATIONS_ERROR,
  GET_MY_APPLICATIONS_READY_FOR_CONTRACTS_SIGNING_SUCCESS,
  GET_MY_APPLICATIONS_READY_FOR_MINUTES_NEGOTIATION_SUCCESS,
} from "@/actions/ApplicationsActions";
import { Application } from "@/types";

const initialState = {
  applications: [],
  myApplications: [],
  applicationsForContractSigning: [],
  applicationsForMinuteNegotiation: [],
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
    case GET_MY_APPLICATIONS_LOADING:
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
    case GET_MY_APPLICATIONS_READY_FOR_CONTRACTS_SIGNING_SUCCESS:
      return {
        ...state,
        loading: false,
        applicationsForContractSigning: action.payload,
      };
    case GET_MY_APPLICATIONS_READY_FOR_MINUTES_NEGOTIATION_SUCCESS:
      return {
        ...state,
        loading: false,
        GET_MY_APPLICATIONS_READY_FOR_MINUTES_NEGOCIATION_SUCCESS:
          action.payload,
      };
    case GET_MY_APPLICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        myApplications: action.payload,
      };

    case GET_APPLICATIONS_ERROR:
    case GET_MY_APPLICATIONS_ERROR:
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
        applications: state.applications.map((application: Application) =>
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
          (application: Application) => application.uuid !== action.payload.id,
        ),
        error: null,
        isError: false,
        loading: false,
      };

    default:
      return state;
  }
}
