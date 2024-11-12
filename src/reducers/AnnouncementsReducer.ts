import {
  GET_ANNOUNCEMENT_LOADING,
  GET_ANNOUNCEMENT_SUCCESS,
  GET_ANNOUNCEMENT_ERROR,
} from "@/actions/AnnouncementActions";
import { Window } from "@/types";

const initialState = {
  announcement: {
    announcement: "",
    roles: [],
    status: "",
    uuid: "",
  },
  error: null,
  isError: false,
  loading: false,
};

type Action = {
  type: string;
  payload: any;
};

export default function announcementsReducer(
  state = initialState,
  action: Action,
) {
  switch (action.type) {
    case GET_ANNOUNCEMENT_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_ANNOUNCEMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        announcement: action.payload,
      };
    case GET_ANNOUNCEMENT_ERROR:
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
