import {
  ADD_TRAINING_SUCCESS,
  FETCH_TRAINING_BY_ID_FAILURE,
  FETCH_TRAINING_BY_ID_REQUEST,
  FETCH_TRAINING_BY_ID_SUCCESS,
  MAKE_DECISION_FAILURE,
  MAKE_DECISION_REQUEST,
  MAKE_DECISION_SUCCESS,
  REQUEST_REVIEW_FAILURE,
  REQUEST_REVIEW_REQUEST,
  REQUEST_REVIEW_SUCCESS,
  UPDATE_TRAINING_SUCCESS,
} from "@/actions/TrainingActions";

const initialState = {
  trainings: [],
  currentTraining: {},
  loading: false,
  requestReviewLoading: false,
  decisionLoading: false,
  total: 0,
  page: 1,
};

export const TrainingReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_TRAININGS":
      return { ...state, trainings: action.payload, loading: false };
    case "FETCH_TRAININGS_REQUEST":
      return { ...state, loading: true };
    case ADD_TRAINING_SUCCESS:
      return {
        ...state,
        trainings: [...state.trainings, action.payload],
        loading: false,
      };
    case UPDATE_TRAINING_SUCCESS:
      return {
        ...state,
        trainings: state.trainings.map((t: any) =>
          t.id === action.payload.id ? action.payload : t
        ),
        loading: false,
      };
    case "DELETE_TRAINING_SUCCESS":
      return {
        ...state,
        trainings: state.trainings.filter(
          (t: any) => t.id !== action.payload.id
        ),
        loading: false,
      };

    case FETCH_TRAINING_BY_ID_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_TRAINING_BY_ID_SUCCESS:
      return { ...state, loading: false, currentTraining: action.payload };

    case FETCH_TRAINING_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case REQUEST_REVIEW_REQUEST:
      return { ...state, requestReviewLoading: true, error: null };

    case REQUEST_REVIEW_SUCCESS:
      return {
        ...state,
        requestReviewLoading: false,
        currentTraining: {
          ...state.currentTraining,
          status: action.payload.status,
        },
      };

    case REQUEST_REVIEW_FAILURE:
      return { ...state, requestReviewLoading: false, error: action.payload };
    
      // sdf make desicion
    case MAKE_DECISION_REQUEST:
      return { ...state, decisionLoading: true, error: null };

    case MAKE_DECISION_SUCCESS:
      return { ...state, decisionLoading: false, currentTraining: action.payload };

    case MAKE_DECISION_FAILURE:
      return { ...state, decisionLoading: false, error: action.payload };
    default:
      return state;
  }
};
