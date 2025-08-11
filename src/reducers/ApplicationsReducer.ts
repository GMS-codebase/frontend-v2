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
  GET_MY_APPLICATIONS_READY_FOR_CONTRACTS_SIGNING_LOADING,
  GET_MY_APPLICATIONS_READY_FOR_MINUTES_NEGOTIATION_LOADING,
  GET_PAGINATED_APPLICATIONS_LOADING,
  GET_PAGINATED_APPLICATIONS_SUCCESS,
} from "@/actions/ApplicationsActions";
import { Application } from "@/types";

const initialState = {
  applications: [],
  paginatedApplications: [],
  total: 0,
  page: 1,
  myApplications: [],
  applicationsForContractSigning: [],
  applicationsForMinuteNegotiation: [],
  error: null,
  isError: false,
  loading: true,
  paginationLoading: true,
  myApplicationsLoading: true,
  applicationsReadyForContractSigningLoading: true,
  applicationsReadyForMinuteNegotiationLoading: true,
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
    case GET_PAGINATED_APPLICATIONS_LOADING:
      return {
        ...state,
        paginationLoading: true,
      };
    case GET_MY_APPLICATIONS_LOADING:
      return {
        ...state,
        myApplicationsLoading: true,
      };
    case GET_MY_APPLICATIONS_READY_FOR_CONTRACTS_SIGNING_LOADING:
      return {
        ...state,
        applicationsReadyForContractSigningLoading: true,
      };

    case GET_MY_APPLICATIONS_READY_FOR_MINUTES_NEGOTIATION_LOADING:
      return {
        ...state,
        applicationsReadyForMinuteNegotiationLoading: true,
      };

    case GET_APPLICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        applications: action.payload.applications,
      };
    case GET_PAGINATED_APPLICATIONS_SUCCESS:
      return {
        ...state,
        paginationLoading: false,
        paginatedApplications: action.payload.applications,
        total: action.payload.total,
        page: action.payload.page,
        totalPages: action.payload.totalPages,
      };
    case GET_MY_APPLICATIONS_READY_FOR_CONTRACTS_SIGNING_SUCCESS:
      return {
        ...state,
        applicationsReadyForContractSigningLoading: false,
        applicationsForContractSigning: action.payload,
      };
    case GET_MY_APPLICATIONS_READY_FOR_MINUTES_NEGOTIATION_SUCCESS:
      return {
        ...state,
        applicationsReadyForMinuteNegotiationLoading: false,
        GET_MY_APPLICATIONS_READY_FOR_MINUTES_NEGOCIATION_SUCCESS:
          action.payload,
      };
    case GET_MY_APPLICATIONS_SUCCESS:
      return {
        ...state,
        myApplicationsLoading: false,
        myApplications: action.payload.data,
        total: action.payload.totalItems,
        page: action.payload.currentPage,
        totalPages: action.payload.totalPages,
      };

    case GET_APPLICATIONS_ERROR:
    case GET_MY_APPLICATIONS_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        myApplicationsLoading:false,
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
