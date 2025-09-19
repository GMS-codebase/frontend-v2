import {
  ADD_COMPETENCE_SUCCESS,
  GET_COMPETENCE_ERROR,
  GET_COMPETENCE_SUCCESS,
  GET_COMPETENCE_LOADING,
  UPDATE_COMPETENCE_SUCCESS,
  DELETE_COMPETENCE_SUCCESS,
  GET_COMPETENCE_BY_ID_ERROR,
  GET_COMPETENCE_BY_ID_LOADING,
  GET_COMPETENCE_BY_ID_SUCCESS,
} from "@/actions/CompetenceAction";

const initialState = {
  competences: [],
  error: null,
  isError: false,
  loading: true,
  total: 0,
  page: 1,
};


type Competence = {
  type: string;
  payload: any;
}

export default function CompetenceReducer(state = initialState, action: Competence) {
  switch (action.type) {
    case GET_COMPETENCE_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_COMPETENCE_SUCCESS:
      return {
        ...state,
        loading: false,
        competences: action.payload.data.data,
        total: action.payload.totalItems,
        page: parseInt(action.payload.currentPage, 10),
      };

    case GET_COMPETENCE_ERROR:
      return {
        ...state,
        isError: true,
        loading: false,
        error: action.payload,
      };
    case ADD_COMPETENCE_SUCCESS:
      return {
        ...state,
        competences: [...state.competences, action.payload.data.data],
        error: null,
        isError: false,
        loading: false,
      };
    case UPDATE_COMPETENCE_SUCCESS:
      return {
        ...state,
        competences: state.competences.map((competence: any) =>
          competence.uuid === action.payload.uuid
            ? { ...competence, ...action.payload.data.data }
            : competence
        ),
        error: null,
        isError: false,
        loading: false,
      };
    case DELETE_COMPETENCE_SUCCESS:
      return {
        ...state,
        competences: state.competences.filter(
          (competence: any) => competence.uuid !== action.payload.data.data.id
        ),
        error: null,
        isError: false,
        loading: false,
      };
        case GET_COMPETENCE_BY_ID_LOADING:
      return {
        ...state,
        loading: true,
        competence: null,
      };
    case GET_COMPETENCE_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        competence: action.payload?.data || null, 
      };
    case GET_COMPETENCE_BY_ID_ERROR:
      return {
        ...state,
        loading: false,
        isError: true,
        error: action.payload,
      };
    default:
      return state;
  }
}
