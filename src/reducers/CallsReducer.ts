import {
  ADD_CALL_SUCCESS,
  GET_CALLS_ERROR,
  GET_CALLS_SUCCESS,
  GET_CALLS_LOADING,
  UPDATE_CALL_SUCCESS,
  DELETE_CALL_SUCCESS,
} from "@/actions/CallsActions";
import { Window } from "@/types";

const initialState = {
  calls: [],
  error: null,
  isError: false,
  loading: true,
};

type Action = {
  type: string;
  payload: any;
};

export default function CallsReducer(state = initialState, action: Action) {
  switch (action.type) {
    case GET_CALLS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_CALLS_SUCCESS:
      return {
        ...state,
        loading: false,
        calls: action.payload,
      };
    case GET_CALLS_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        error: action.payload,
      };
    case ADD_CALL_SUCCESS:
      return {
        ...state,
        calls: [...state.calls, action.payload],
        error: null,
        isError: false,
        loading: false,
      };
    case UPDATE_CALL_SUCCESS:
      return {
        ...state,
        calls: state.calls.map((call: any) =>
          call.uuid === action.payload.uuid
            ? { ...call, ...action.payload.data }
            : call,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    case DELETE_CALL_SUCCESS:
      return {
        ...state,
        calls: state.calls.filter(
          (call: any) => call.uuid !== action.payload.id,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    default:
      return state;
  }
}
