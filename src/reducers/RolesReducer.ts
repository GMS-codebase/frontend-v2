import {
  ADD_ROLE_SUCCESS,
  GET_ROLES_ERROR,
  GET_ROLES_SUCCESS,
  GET_ROLES_LOADING,
  UPDATE_ROLE_SUCCESS,
  DELETE_ROLE_SUCCESS,
} from "@/actions/RolesActions";

const initialState = {
  roles: [],
  error: null,
  isError: false,
  loading: true,
};

type Action = {
  type: string;
  payload: any;
};

export default function RolesReducer(state = initialState, action: Action) {
  switch (action.type) {
    case GET_ROLES_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_ROLES_SUCCESS:
      return {
        ...state,
        loading: false,
        roles: action.payload,
      };
    case GET_ROLES_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        error: action.payload,
      };
    case ADD_ROLE_SUCCESS:
      return {
        ...state,
        roles: [...state.roles, action.payload],
        error: null,
        isError: false,
        loading: false,
      };
    case UPDATE_ROLE_SUCCESS:
      return {
        ...state,
        roles: state.roles.map((call: any) =>
          call.uuid === action.payload.id
            ? { ...call, ...action.payload.data }
            : call,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    case DELETE_ROLE_SUCCESS:
      return {
        ...state,
        roles: state.roles.filter(
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
