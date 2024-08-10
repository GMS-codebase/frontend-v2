import { 
  ADD_EMPLOYEE_SUCCESS, 
  GET_EMPLOYEES_ERROR, 
  GET_EMPLOYEES_SUCCESS, 
  GET_EMPLOYEES_LOADING, 
  UPDATE_EMPLOYEE_SUCCESS, 
  DELETE_EMPLOYEE_SUCCESS 
} from "@/actions/EmployeesActions";
import { Window } from "@/types";

const initialState = {
  employees: [],
  error: null,
  isError: false,
  loading: false
};

type Action = {
  type: string;
  payload: any;
};

export default function EmployeesReducer(state = initialState, action: Action) {
  switch (action.type) {
    case GET_EMPLOYEES_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_EMPLOYEES_SUCCESS:
      return {
        ...state,
        loading: false,
        employees: action.payload
      };
    case GET_EMPLOYEES_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        error: action.payload
      };
    case ADD_EMPLOYEE_SUCCESS:
      return {
        ...state,
        employees: [...state.employees, action.payload],
        error: null,
        isError: false,
        loading: false
      };
    case UPDATE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        employees: state.employees.map((employee: Window) => 
          employee.uuid === action.payload.id ? { ...employee, ...action.payload.data } : employee
        ),
        error: null,
        isError: false,
        loading: false
      };
    case DELETE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        employees: state.employees.filter((employee: Window) => employee.uuid !== action.payload.id),
        error: null,
        isError: false,
        loading: false
      };
    default:
      return state;
  }
}
