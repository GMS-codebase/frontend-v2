import {
  ADD_BUDGET_LINE_SUCCESS,
  DELETE_BUDGET_LINE_SUCCESS,
  GET_BUDGET_LINES_ERROR,
  GET_BUDGET_LINES_LOADING,
  GET_BUDGET_LINES_SUCCESS,
  UPDATE_BUDGET_LINE_SUCCESS,
} from "@/actions/BudgetLinesActions";
import { BudgetLine } from "@/types";

const initialState = {
  budgetLines: [],
  error: null,
  isError: false,
  loading: false,
};

type Action = {
  type: string;
  payload: any;
};

export default function BudgetLinesReducer(
  state = initialState,
  action: Action,
) {
  switch (action.type) {
    case GET_BUDGET_LINES_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_BUDGET_LINES_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        error: action.payload,
      };
    case GET_BUDGET_LINES_SUCCESS:
      return {
        ...state,
        budgetLines: action.payload,
        error: null,
        isError: false,
        loading: false,
      };
    case ADD_BUDGET_LINE_SUCCESS:
      return {
        ...state,
        budgetLines: [...state.budgetLines, action.payload],
        error: null,
        isError: false,
        loading: false,
      };
    case UPDATE_BUDGET_LINE_SUCCESS:
      return {
        ...state,
        budgetLines: state.budgetLines.map((trade: BudgetLine) =>
          trade.uuid == action.payload.uuid
            ? { ...trade, ...action.payload }
            : trade,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    case DELETE_BUDGET_LINE_SUCCESS:
      return {
        ...state,
        budgetLines: state.budgetLines.filter(
          (trade: BudgetLine) => trade.uuid !== action.payload.id,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    default:
      return state;
  }
}
