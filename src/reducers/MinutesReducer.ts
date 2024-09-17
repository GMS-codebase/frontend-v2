import {
  GET_MINUTES_ERROR,
  GET_MINUTES_LOADING,
  GET_MINUTES_SUCCESS,
  ADD_MINUTES_SUCCESS,
  UPDATE_MINUTES_SUCCESS,
  DELETE_MINUTES_SUCCESS,
} from "@/actions/MinutesActions";
import { Contract } from "@/types";

const initialState = {
  minutes: [],
  error: null,
  isError: false,
  loading: false,
};

type Action = {
  type: string;
  payload: any;
};

export default function MinutesReducer(state = initialState, action: Action) {
  switch (action.type) {
    case GET_MINUTES_LOADING:
      return {
        ...state,
        loading: true,
      };

    case GET_MINUTES_SUCCESS:
      return {
        ...state,
        loading: false,
        minutes: action.payload,
      };

    case GET_MINUTES_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        error: action.payload,
      };

    case ADD_MINUTES_SUCCESS:
      return {
        ...state,
        minutes: [...state.minutes, action.payload],
        error: null,
        isError: false,
        loading: false,
      };

    case UPDATE_MINUTES_SUCCESS:
      return {
        ...state,
        minutes: state.minutes.map((minute: Contract) =>
          minute.uuid === action.payload.id
            ? { ...minute, ...action.payload.data }
            : minute,
        ),
        error: null,
        isError: false,
        loading: false,
      };

    case DELETE_MINUTES_SUCCESS:
      return {
        ...state,
        minutes: state.minutes.filter(
          (minute: Contract) => minute.uuid !== action.payload.id,
        ),
        error: null,
        isError: false,
        loading: false,
      };

    default:
      return state;
  }
}
