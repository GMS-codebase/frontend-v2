import { GET_CALLS_ERROR, GET_CALLS_LOADING, GET_CALLS_SUCCESS } from "@/actions/CallsActions";
import { GET_SECTORS_ERROR, GET_SECTORS_LOADING, GET_SECTORS_SUCCESS } from "@/actions/SectorsActions";
import { GET_TRADES_ERROR, GET_TRADES_LOADING, GET_TRADES_SUCCESS } from "@/actions/TradesActions";
import { GET_WINDOWS_ERROR, GET_WINDOWS_LOADING, GET_WINDOWS_SUCCESS } from "@/actions/WindowsActions";
import axios from "axios";
import { Dispatch, UnknownAction } from "redux";
export const AxiosAPI = axios.create({
    baseURL: process.env.BACKEND_URL ?? "http://10.10.77.42:8081/api/v2",
    headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FwcGxpY2FudCI6ZmFsc2UsImVtYWlsIjoibnlpcmluZ2Fib2RhdmlkNjJAZ21haWwuY29tIiwiaXNFbXBsb3llZSI6ZmFsc2UsInJvbGUiOiJBRE1JTiIsImlzQWN0aXZlIjp0cnVlLCJwb3NpdGlvbiI6IkFETUlOIiwiaWF0IjoxNzIzMTE4MjYwLCJleHAiOjE3MjUxOTE4NjB9.N2OYm5hhJRi2tLfc9NIpaJPdmczBTYqJ9EybxS1KTE0"
    }
})

export const getWindows = async(dispatch: Dispatch<UnknownAction>)=>{
    dispatch({type: GET_WINDOWS_LOADING})
    AxiosAPI.get("/window/all")
        .then(res=>{
            dispatch({type: GET_WINDOWS_SUCCESS, payload: res.data.data.data});
        })
        .catch((err)=>{
            dispatch({type: GET_WINDOWS_ERROR, payload: err.response.data.error})
        })
}

export const getSectors = async(dispatch: Dispatch<UnknownAction>)=>{
    dispatch({type: GET_SECTORS_LOADING})
    AxiosAPI.get("/Sectors")
        .then(res=>{
            dispatch({type: GET_SECTORS_SUCCESS, payload: res.data.data});
        })
        .catch((err)=>{
            dispatch({type: GET_SECTORS_ERROR, payload: err.response.data.error})
        })
}
export const getTrades = async(dispatch: Dispatch<UnknownAction>)=>{
    dispatch({type: GET_TRADES_LOADING})
    AxiosAPI.get("/trade")
        .then(res=>{
            dispatch({type: GET_TRADES_SUCCESS, payload: res.data.data});
        })
        .catch((err)=>{
            dispatch({type: GET_TRADES_ERROR, payload: err.response.data.error})
        })
}
export const getCalls = async(dispatch: Dispatch<UnknownAction>)=>{
    dispatch({type: GET_CALLS_LOADING})
    AxiosAPI.get("/call/all")
        .then(res=>{
            dispatch({type: GET_CALLS_SUCCESS, payload: res.data?.data?.data});
        })
        .catch((err)=>{
            dispatch({type: GET_CALLS_ERROR, payload: err.response.data.error})
        })
}
export const getApplicants = async(dispatch: Dispatch<UnknownAction>)=>{
    dispatch({type: GET_TRADES_LOADING})
    AxiosAPI.get("/applicant")
        .then(res=>{
            dispatch({type: GET_TRADES_SUCCESS, payload: res.data.data});
        })
        .catch((err)=>{
            dispatch({type: GET_TRADES_ERROR, payload: err.response.data.error})
        })
}
export const getApplications = async(dispatch: Dispatch<UnknownAction>)=>{
    dispatch({type: GET_TRADES_LOADING})
    AxiosAPI.get("/application")
        .then(res=>{
            dispatch({type: GET_TRADES_SUCCESS, payload: res.data.data});
        })
        .catch((err)=>{
            dispatch({type: GET_TRADES_ERROR, payload: err.response.data.error})
        })
}