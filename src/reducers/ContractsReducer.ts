import {
  GET_CONTRACTS_ERROR,
  GET_CONTRACTS_LOADING,
  GET_CONTRACTS_SUCCESS,
  ADD_CONTRACTS_SUCCESS,
  UPDATE_CONTRACTS_SUCCESS,
  DELETE_CONTRACTS_SUCCESS,
} from "@/actions/ContractActions";
import { Contract } from "@/types";

const initialState = {
  contracts: [],
  error: null,
  isError: false,
  loading: true,
};

type Action = {
  type: string;
  payload: any;
};

export default function ContractsReducer(state = initialState, action: Action) {
  switch (action.type) {
    case GET_CONTRACTS_LOADING:
      return {
        ...state,
        loading: true,
      };

    case GET_CONTRACTS_SUCCESS:
      return {
        ...state,
        loading: false,
        contracts: action.payload,
      };

    case GET_CONTRACTS_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        error: action.payload,
      };

    case ADD_CONTRACTS_SUCCESS:
      return {
        ...state,
        contracts: [...state.contracts, action.payload],
        error: null,
        isError: false,
        loading: false,
      };

    case UPDATE_CONTRACTS_SUCCESS:
      return {
        ...state,
        contracts: state.contracts.map((contract: Contract) =>
          contract.uuid === action.payload.id
            ? { ...contract, ...action.payload.data }
            : contract,
        ),
        error: null,
        isError: false,
        loading: false,
      };

    case DELETE_CONTRACTS_SUCCESS:
      return {
        ...state,
        contracts: state.contracts.filter(
          (contract: Contract) => contract.uuid !== action.payload.id,
        ),
        error: null,
        isError: false,
        loading: false,
      };

    default:
      return state;
  }
}
