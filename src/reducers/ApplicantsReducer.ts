import {
  ADD_APPLICANT_SUCCESS,
  GET_APPLICANTS_ERROR,
  GET_APPLICANTS_SUCCESS,
  GET_APPLICANTS_LOADING,
  UPDATE_APPLICANT_SUCCESS,
  DELETE_APPLICANT_SUCCESS,
} from "@/actions/ApplicantsActions";
import { Window } from "@/types";

const initialState = {
  applicants: [],
  error: null,
  isError: false,
  loading: true,
  total: 0,
  page: 1,
  totalPages: 0,
};

type Action = {
  type: string;
  payload: any;
};

export default function ApplicantsReducer(
  state = initialState,
  action: Action,
) {
  switch (action.type) {
    case GET_APPLICANTS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_APPLICANTS_SUCCESS:
      return {
        ...state,
        loading: false,
        applicants: action.payload.data,
        total: action.payload.totalItems,
        page: action.payload.currentPage,
        totalPages: action.payload.totalPages,
      };
    case GET_APPLICANTS_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        error: action.payload,
      };
    case ADD_APPLICANT_SUCCESS:
      return {
        ...state,
        applicants: [...state.applicants, action.payload],
        error: null,
        isError: false,
        loading: false,
      };
    case UPDATE_APPLICANT_SUCCESS:
      return {
        ...state,
        applicants: state.applicants.map((applicant: Window) =>
          applicant.uuid === action.payload.id
            ? { ...applicant, ...action.payload.data }
            : applicant,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    case DELETE_APPLICANT_SUCCESS:
      return {
        ...state,
        applicants: state.applicants.filter(
          (applicant: Window) => applicant.uuid !== action.payload.id,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    default:
      return state;
  }
}
