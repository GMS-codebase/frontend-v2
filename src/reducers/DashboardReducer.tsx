import {
  ADD_CALL_SUCCESS,
  GET_CALLS_ERROR,
  GET_CALLS_SUCCESS,
  GET_CALLS_LOADING,
  UPDATE_CALL_SUCCESS,
  DELETE_CALL_SUCCESS,
} from "@/actions/CallsActions";
import {
  GET_DASHBOARD_ERROR,
  GET_DASHBOARD_LOADING,
  GET_DASHBOARD_SUCCESS,
  GET_PRIORITY_SECTORS_DATA,
} from "@/actions/DashboardActions";
import { Window } from "@/types";

const initialState = {
  loading: false,
  error: "",
  isError: false,
  data: {
    applications: [],
    totalApplications: 0,
    totalApplicants: 0,
    applicationsBySector: {},
    currentStage: "",
    sectorSummary: [],
    applicants: [],
    sectorWithNumberOfAPplicants: [],
  },
  sectorsData: {
    Manufacturing: {
      countApplicants: 0,
      countApplications: 0,
    },
    "Hospitality & Tourism": {
      countApplicants: 0,
      countApplications: 0,
    },
    "Transport & Logistics": {
      countApplicants: 0,
      countApplications: 0,
    },
    Agriculture: {
      countApplicants: 0,
      countApplications: 0,
    },
    Energy: {
      countApplicants: 0,
      countApplications: 0,
    },
    Mining: {
      countApplicants: 0,
      countApplications: 0,
    },
  },
};

type Action = {
  type: string;
  payload: any;
};

export default function DashboardReducer(state = initialState, action: Action) {
  switch (action.type) {
    case GET_DASHBOARD_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_DASHBOARD_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case GET_PRIORITY_SECTORS_DATA:
      return {
        ...state,
        loading: false,
        sectorsData: {
          ...state.sectorsData,
          [action.payload.sectorName]: action.payload.data,
        },
      };
    case GET_DASHBOARD_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
