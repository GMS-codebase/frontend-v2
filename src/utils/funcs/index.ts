import { GET_WINDOWS_ERROR, GET_WINDOWS_LOADING, GET_WINDOWS_SUCCESS } from "@/actions/WindowsActions";
import axios from "axios";
import { Dispatch, UnknownAction } from "redux";
export const AxiosAPI = axios.create({
    baseURL: process.env.BACKEND_URL ?? "http://localhost:3000/api/v2",
    headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FwcGxpY2FudCI6ZmFsc2UsImVtYWlsIjoibnlpcmluZ2Fib2RhdmlkNjJAZ21haWwuY29tIiwiaXNFbXBsb3llZSI6ZmFsc2UsInJvbGUiOiJBRE1JTiIsImlzQWN0aXZlIjp0cnVlLCJwb3NpdGlvbiI6IkFETUlOIiwiaWF0IjoxNzIzMDUxNzI2LCJleHAiOjE3MjUxMjUzMjZ9.Yp2FCQjWdZJJkYQlZG6OC2SMKqiNWGivD6aVFS6jGxc"
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