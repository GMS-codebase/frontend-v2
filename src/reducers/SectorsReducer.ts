import {
  ADD_SECTOR_SUCCESS,
  GET_SECTORS_ERROR,
  GET_SECTORS_SUCCESS,
  GET_SECTORS_LOADING,
  UPDATE_SECTOR_SUCCESS,
  DELETE_SECTOR_SUCCESS,
  ADD_TRADE_SECTOR_SUCCESS,
} from "@/actions/SectorsActions";
import { Sector } from "@/types";

const initialState = {
  sectors: [],
  error: null,
  isError: false,
  loading: true,
};

type Action = {
  type: string;
  payload: any;
};

export default function SectorsReducer(state = initialState, action: Action) {
  switch (action.type) {
    case GET_SECTORS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_SECTORS_SUCCESS:
      return {
        ...state,
        loading: false,
        sectors: action.payload,
      };
    case GET_SECTORS_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        error: action.payload,
      };
    case ADD_SECTOR_SUCCESS:
      return {
        ...state,
        sectors: [...state.sectors, action.payload],
        error: null,
        isError: false,
        loading: false,
      };
    case UPDATE_SECTOR_SUCCESS:
      return {
        ...state,
        sectors: state.sectors.map((sector: Sector) =>
          sector.uuid === action.payload.uuid
            ? { ...sector, ...action.payload }
            : sector,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    case ADD_TRADE_SECTOR_SUCCESS:
      return {
        ...state,
        sectors: state.sectors.map((sector: Sector) =>
          sector.uuid === action.payload.sectorId
            ? {
                ...sector,
                trades: [...(sector.trades || []), action.payload.trade],
              }
            : sector,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    case DELETE_SECTOR_SUCCESS:
      return {
        ...state,
        sectors: state.sectors.filter(
          (sector: Sector) => sector.uuid !== action.payload.id,
        ),
        error: null,
        isError: false,
        loading: false,
      };
    default:
      return state;
  }
}
