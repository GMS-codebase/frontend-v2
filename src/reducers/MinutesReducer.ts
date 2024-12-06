import {
  GET_MINUTES_ERROR,
  GET_MINUTES_LOADING,
  GET_MINUTES_SUCCESS,
  ADD_MINUTES_SUCCESS,
  UPDATE_MINUTES_SUCCESS,
  DELETE_MINUTES_SUCCESS,
  GET_APPROVED_MINUTES_SUCCESS,
  GET_UPLOADED_MINUTES_SUCCESS,
  GET_REJECTED_MINUTES_SUCCESS,
  GET_UPLOADED_MINUTES_LOADING,
  GET_APPROVED_MINUTES_LOADING,
  GET_REJECTED_MINUTES_LOADING,
  GET_APPLICATIONS_READY_FOR_MINUTES_LOADING,
  GET_APPLICATIONS_READY_FOR_MINUTES_SUCCESS,
  GET_NEGOTIATED_MINUTES_SUCCESS,
  GET_NEGOTIATED_MINUTES_LOADING,
} from "@/actions/MinutesActions";
import { Contract } from "@/types";

const initialState = {
  minutes: [],
  uploadedMinutesLoading: false,
  approvedMinutesLoading: false,
  rejectedMinutesLoading: false,
  negotiatedMinutesLoading: false,
  uploadedMinutes: [],
  approvedMinutes: [],
  rejectedMinutes: [],
  negotiatedMinutes: [],
  applicationsReadyForMinutesLoading: false,
  applicationsReadyForMinutes: [],
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
    case GET_APPLICATIONS_READY_FOR_MINUTES_LOADING:
      return {
        ...state,
        applicationsReadyForMinutesLoading: true,
      };
    case GET_UPLOADED_MINUTES_LOADING:
      return {
        ...state,
        uploadedMinutesLoading: true,
      };
    case GET_APPROVED_MINUTES_LOADING:
      return {
        ...state,
        approvedMinutesLoading: true,
      };
    case GET_REJECTED_MINUTES_LOADING:
      return {
        ...state,
        rejectedMinutesLoading: true,
      };
    case GET_NEGOTIATED_MINUTES_LOADING:
      return {
        ...state,
        negotiatedMinutesLoading: true,
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
    case GET_UPLOADED_MINUTES_SUCCESS:
      return {
        ...state,
        uploadedMinutes: action.payload,
        uploadedMinutesLoading: false,
      };
    case GET_APPROVED_MINUTES_SUCCESS:
      return {
        ...state,
        approvedMinutes: action.payload,
        approvedMinutesLoading: false,
      };
    case GET_REJECTED_MINUTES_SUCCESS:
      return {
        ...state,
        rejectedMinutes: action.payload,
        rejectedMinutesLoading: false,
      };
    case GET_APPLICATIONS_READY_FOR_MINUTES_SUCCESS:
      return {
        ...state,
        applicationsReadyForMinutes: action.payload,
        applicationsReadyForMinutesLoading: false,
      };
    case GET_NEGOTIATED_MINUTES_SUCCESS:
      return {
        ...state,
        negotiatedMinutes: action.payload,
        negotiatedMinutesLoading: false,
      };
    default:
      return state;
  }
}
