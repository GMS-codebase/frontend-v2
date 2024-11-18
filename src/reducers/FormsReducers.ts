import {
  ADD_FORM_SUCCESS,
  DELETE_FORM_SUCCESS,
  GET_FORMS_ERROR,
  GET_FORMS_LOADING,
  GET_FORMS_SUCCESS,
  UPDATE_FORM_SUCCESS,
} from "@/actions/FormsActions";
import { Form } from "@/types";

const initialState = {
  forms: [],
  error: null,
  isError: false,
  loading: false,
};

type Action = {
  type: string;
  payload: any;
};

export default function FormsReducer(state = initialState, action: Action) {
  switch (action.type) {
    case GET_FORMS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_FORMS_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        error: action.payload,
      };
    case GET_FORMS_SUCCESS:
      return {
        ...state,
        forms: action.payload,
        error: null,
        isError: false,
        loading: false,
      };
    case ADD_FORM_SUCCESS:
      return {
        ...state,
        forms: [...state.forms, action.payload],
        error: null,
        isError: false,
        loading: false,
      };
    case UPDATE_FORM_SUCCESS:
      return {
        ...state,
        forms: state.forms.map((trade: Form) =>
          trade.uuid == action.payload.uuid
            ? { ...trade, ...action.payload }
            : trade,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    case DELETE_FORM_SUCCESS:
      return {
        ...state,
        forms: state.forms.filter(
          (trade: Form) => trade.uuid !== action.payload.id,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    default:
      return state;
  }
}
