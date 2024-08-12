import { 
  ADD_TRADE_SUCCESS, 
  GET_TRADES_ERROR, 
  GET_TRADES_SUCCESS, 
  GET_TRADES_LOADING, 
  UPDATE_TRADE_SUCCESS, 
  DELETE_TRADE_SUCCESS 
} from "@/actions/TradesActions";
import { Trade } from "@/types";

const initialState = {
  trades: [],
  error: null,
  isError: false,
  loading: false
};

type Action = {
  type: string;
  payload: any;
};

export default function TradesReducer(state = initialState, action: Action) {
  switch (action.type) {
    case GET_TRADES_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_TRADES_SUCCESS:
      return {
        ...state,
        loading: false,
        trades: action.payload
      };
    case GET_TRADES_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        error: action.payload
      };
    case ADD_TRADE_SUCCESS:
      return {
        ...state,
        trades: [...state.trades, action.payload],
        error: null,
        isError: false,
        loading: false
      };
    case UPDATE_TRADE_SUCCESS:
      return {
        ...state,
        trade: state.trades.map((trade: Trade) => 
          trade.uuid === action.payload.id ? { ...trade, ...action.payload.data } : trade
        ),
        error: null,
        isError: false,
        loading: false
      };
    case DELETE_TRADE_SUCCESS:
      return {
        ...state,
        trades: state.trades.filter((trade: Trade) => trade.uuid !== action.payload.id),
        error: null,
        isError: false,
        loading: false
      };
    default:
      return state;
  }
}
