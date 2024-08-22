import {
  LOGIN,
  LOGOUT,
  SET_APPLICANT_PROFILE,
  SET_PERMISSIONS,
  SET_USER_PROFILE,
} from "@/actions/AuthActions";
import { deleteCookie, setCookie } from "cookies-next";

const initialState = {
  userProfile: null,
  // credentials are tokens
  credentials: null,
  is_authenticated: false,
  permissions: [],
  auth_expire_time: {},
  token_expire_time: null,
  applicantProfile: null,
};

type Action = {
  type: string;
  payload: any;
};

export default function authReducer(state = initialState, action: Action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        userProfile: action.payload.userProfile,
        credentials: action.payload.credentials,
        is_authenticated: true,
        auth_expire_time: action.payload.auth_expire_time,
        token_expire_time: action.payload.token_expire_time,
      };
    case SET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
      };
    case SET_APPLICANT_PROFILE:
      return {
        ...state,
        applicantProfile: action.payload,
      };
    case LOGOUT:
      deleteCookie("token");
      window.location.reload();
      return initialState;
    case SET_PERMISSIONS:
      return {
        ...state,
        permissions: action.payload,
      };
    default:
      return state;
  }
}
