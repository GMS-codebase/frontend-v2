import {
  GET_CONTACTS_SUCCESS,
  GET_CONTACTS_ERROR,
  ADD_CONTACT_SUCCESS,
  UPDATE_CONTACT_SUCCESS,
  DELETE_CONTACT_SUCCESS,
  GET_CONTACTS_LOADING,
  GET_MY_CONTACTS_LOADING,
  GET_MY_CONTACTS_SUCCESS,
  GET_MY_CONTACTS_ERROR,
} from "@/actions/ContactsActions";
import { Contact } from "@/types";

const initialState = {
  contacts: [],
  myContacts: [],
  error: null,
  isError: false,
  loading: true,
};

type Action = {
  type: string;
  payload: any;
};

export default function ContactsReducer(state = initialState, action: Action) {
  switch (action.type) {
    case GET_CONTACTS_LOADING:
    case GET_MY_CONTACTS_LOADING:
      return {
        ...state,
        loading: true,
      };

    case GET_CONTACTS_SUCCESS:
      return {
        ...state,
        loading: false,
        contacts: action.payload,
      };

    case GET_MY_CONTACTS_SUCCESS:
      return {
        ...state,
        loading: false,
        myContacts: action.payload,
      };

    case GET_CONTACTS_ERROR:
    case GET_MY_CONTACTS_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        error: action.payload,
      };

    case ADD_CONTACT_SUCCESS:
      return {
        ...state,
        contacts: [...state.contacts, action.payload],
        error: null,
        isError: false,
        loading: false,
      };

    case UPDATE_CONTACT_SUCCESS:
      return {
        ...state,
        contacts: state.contacts.map((application: Contact) =>
          application.uuid === action.payload.uuid
            ? { ...application, ...action.payload.data }
            : application
        ),
        error: null,
        isError: false,
        loading: false,
      };

    case DELETE_CONTACT_SUCCESS:
      return {
        ...state,
        contacts: state.contacts.filter(
          (application: Contact) => application.uuid !== action.payload.uuid
        ),
        error: null,
        isError: false,
        loading: false,
      };

    default:
      return state;
  }
}
