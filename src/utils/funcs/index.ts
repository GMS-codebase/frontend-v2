import { GET_CALLS_ERROR, GET_CALLS_LOADING, GET_CALLS_SUCCESS } from "@/actions/CallsActions";
import { GET_SECTORS_ERROR, GET_SECTORS_LOADING, GET_SECTORS_SUCCESS } from "@/actions/SectorsActions";
import { GET_TRADES_ERROR, GET_TRADES_LOADING, GET_TRADES_SUCCESS } from "@/actions/TradesActions";
import { GET_WINDOWS_ERROR, GET_WINDOWS_LOADING, GET_WINDOWS_SUCCESS } from "@/actions/WindowsActions";
import { Dispatch, UnknownAction } from "redux";
import { authorizedApi } from "../api";
import { GET_APPLICANTS_ERROR, GET_APPLICANTS_LOADING, GET_APPLICANTS_SUCCESS } from "@/actions/ApplicantsActions";
import { SET_USER_PROFILE } from "@/actions/AuthActions";
import { GET_EMPLOYEES_ERROR, GET_EMPLOYEES_LOADING, GET_EMPLOYEES_SUCCESS } from "@/actions/EmployeesActions";
export const getWindows = async(dispatch: Dispatch<UnknownAction>)=>{
    dispatch({type: GET_WINDOWS_LOADING})
    authorizedApi.get("/window/all")
        .then(res=>{
            dispatch({type: GET_WINDOWS_SUCCESS, payload: res.data.data.data});
        })
        .catch((err)=>{
            dispatch({type: GET_WINDOWS_ERROR, payload: err.response.data.error})
        })
}

export const getMyProfile = async(dispatch: Dispatch<UnknownAction>)=>{
    authorizedApi.get("/auth/me")
        .then(res=>{
            dispatch({type: SET_USER_PROFILE, payload: res.data.data.message}); //Todo: change this only when the BEs change the response schema
        })
        .catch((err)=>{
            dispatch({type: GET_SECTORS_ERROR, payload: err.response.data.error})
        })
}

export const getSectors = async(dispatch: Dispatch<UnknownAction>)=>{
    dispatch({type: GET_SECTORS_LOADING})
    authorizedApi.get("/Sectors")
        .then(res=>{
            dispatch({type: GET_SECTORS_SUCCESS, payload: res.data.data});
        })
        .catch((err)=>{
            dispatch({type: GET_SECTORS_ERROR, payload: err.response.data.error})
        })
}
export const getTrades = async(dispatch: Dispatch<UnknownAction>)=>{
    dispatch({type: GET_TRADES_LOADING})
    authorizedApi.get("/trade")
        .then(res=>{
            dispatch({type: GET_TRADES_SUCCESS, payload: res.data.data});
        })
        .catch((err)=>{
            dispatch({type: GET_TRADES_ERROR, payload: err.response.data.error})
        })
}
export const getCalls = async(dispatch: Dispatch<UnknownAction>)=>{
    dispatch({type: GET_CALLS_LOADING})
    authorizedApi.get("/call/all")
        .then(res=>{
            dispatch({type: GET_CALLS_SUCCESS, payload: res.data?.data?.data});
        })
        .catch((err)=>{
            dispatch({type: GET_CALLS_ERROR, payload: err.response.data.error})
        })
}
export const getEmployees = async(dispatch: Dispatch<UnknownAction>)=>{
    dispatch({type: GET_EMPLOYEES_LOADING})
    authorizedApi.get("/employee/all")
        .then(res=>{
            dispatch({type: GET_EMPLOYEES_SUCCESS, payload: res.data.data.message}); //Todo: change this only when the BEs change the response schema
        })
        .catch((err)=>{
            dispatch({type: GET_EMPLOYEES_ERROR, payload: err.response.data.error})
        })
}
export const getApplicants = async(dispatch: Dispatch<UnknownAction>)=>{
    dispatch({type: GET_APPLICANTS_LOADING})
    authorizedApi.get("/applicant/all")
        .then(res=>{
            dispatch({type: GET_APPLICANTS_SUCCESS, payload: res.data.data.message}); //Todo: change this only when the BEs change the response schema
        })
        .catch((err)=>{
            dispatch({type: GET_APPLICANTS_ERROR, payload: err.response.data.error})
        })
}
export const getApplications = async(dispatch: Dispatch<UnknownAction>)=>{
    dispatch({type: GET_TRADES_LOADING})
    authorizedApi.get("/application")
        .then(res=>{
            dispatch({type: GET_TRADES_SUCCESS, payload: res.data.data});
        })
        .catch((err)=>{
            dispatch({type: GET_TRADES_ERROR, payload: err.response.data.error})
        })
}