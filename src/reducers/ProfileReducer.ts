import {
  GET_PROFILE_LOADING,
  GET_PROFILE_ERROR,
  GET_PROFILE_SUCCESS,
} from "@/actions/ProfileActions";
import { Window } from "@/types";

const initialState = {
  profile: null,
  error: null,
  isError: false,
  loading: false,
};

type Action = {
  type: string;
  payload: any;
};

export default function ProfileReducer(state = initialState, action: Action) {
  switch (action.type) {
    case GET_PROFILE_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: action.payload,
      };
    case GET_PROFILE_ERROR:
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
