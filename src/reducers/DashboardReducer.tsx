import {
    ADD_CALL_SUCCESS,
    GET_CALLS_ERROR,
    GET_CALLS_SUCCESS,
    GET_CALLS_LOADING,
    UPDATE_CALL_SUCCESS,
    DELETE_CALL_SUCCESS,
  } from "@/actions/CallsActions";
import { GET_DASHBOARD_ERROR, GET_DASHBOARD_LOADING, GET_DASHBOARD_SUCCESS } from "@/actions/DashboardActions";
  import { Window } from "@/types";
  
  const initialState = {
    loading: false,
    error: "",
    isError: false,
    data: {
        "applications": [],
        "totalApplications": 0,
        "totalApplicants": 0,
        "applicationsBySector": {},
        "currentStage": "",
        "sectorSummary":[],
        "applicants":[],
        "sectorWithNumberOfAPplicants":[]

    }
  }
  
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
  