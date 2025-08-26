import {
  ADD_TRAINEE_REQUEST_FAILURE,
  ADD_TRAINEE_REQUEST_REQUEST,
  ADD_TRAINEE_REQUEST_SUCCESS,
  ADD_TRAINING_SUCCESS,
  CERTIFICATION_DECISION_FAILURE,
  CERTIFICATION_DECISION_REQUEST,
  CERTIFICATION_DECISION_SUCCESS,
  CERTIFICATION_REVIEW_FAILURE,
  CERTIFICATION_REVIEW_REQUEST,
  CERTIFICATION_REVIEW_SUCCESS,
  EDIT_TRAINEE_REQUEST_FAILURE,
  EDIT_TRAINEE_REQUEST_REQUEST,
  EDIT_TRAINEE_REQUEST_SUCCESS,
  FETCH_TRAINING_BY_ID_FAILURE,
  FETCH_TRAINING_BY_ID_REQUEST,
  FETCH_TRAINING_BY_ID_SUCCESS,
  MAKE_DECISION_FAILURE,
  MAKE_DECISION_REQUEST,
  MAKE_DECISION_SUCCESS,
  REMOVE_TRAINEE_REQUEST_FAILURE,
  REMOVE_TRAINEE_REQUEST_REQUEST,
  REMOVE_TRAINEE_REQUEST_SUCCESS,
  REQUEST_RESPONSE_FAILURE,
  REQUEST_RESPONSE_REQUEST,
  REQUEST_RESPONSE_SUCCESS,
  REQUEST_REVIEW_FAILURE,
  REQUEST_REVIEW_REQUEST,
  REQUEST_REVIEW_SUCCESS,
  UPDATE_TRAINING_SUCCESS,
} from "@/actions/TrainingActions";

const initialState = {
  trainings: [],
  currentTraining: {} as any,
  loading: false,
  requestReviewLoading: false,
  decisionLoading: false,
  certificationLoading: false,
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
      return {
        ...state,
        decisionLoading: false,
        currentTraining: action.payload,
      };

    case MAKE_DECISION_FAILURE:
      return { ...state, decisionLoading: false, error: action.payload };

    //request certification LB
    case CERTIFICATION_REVIEW_REQUEST:
      return { ...state, certificationLoading: true, error: null };

    case CERTIFICATION_REVIEW_SUCCESS:
      return {
        ...state,
        certificationLoading: false,
        currentTraining: {
          ...state.currentTraining,
          trainees: state.currentTraining?.trainees.map((trainee: any) => {
            const updated = action.payload.find(
              (u: any) => u.uuid === trainee.uuid
            );
            return updated ? updated : trainee;
          }),
        },
      };

    case CERTIFICATION_REVIEW_FAILURE:
      return { ...state, certificationLoading: false, error: action.payload };

    //approve certification LB
    case CERTIFICATION_DECISION_REQUEST:
      return { ...state, certificationLoading: true, error: null };

    case CERTIFICATION_DECISION_SUCCESS:
      return {
        ...state,
        certificationLoading: false,
        currentTraining: {
          ...state.currentTraining,
          trainees: state.currentTraining?.trainees.map((trainee: any) => {
            const updated = action.payload.find(
              (u: any) => u.uuid === trainee.uuid
            );
            return updated ? updated : trainee;
          }),
        },
      };

    case CERTIFICATION_DECISION_FAILURE:
      return { ...state, certificationLoading: false, error: action.payload };

    //applicant request add, remove and edit trainees
    case ADD_TRAINEE_REQUEST_REQUEST:
      return { ...state, decisionLoading: true, error: null };

    case ADD_TRAINEE_REQUEST_SUCCESS:
      return {
        ...state,
        decisionLoading: false,
        // currentTraining: action.payload,
      };

    case ADD_TRAINEE_REQUEST_FAILURE:
      return { ...state, decisionLoading: false, error: action.payload };

    //applicant request remove trainee
    case REMOVE_TRAINEE_REQUEST_REQUEST:
      return { ...state, decisionLoading: true, error: null };

    case REMOVE_TRAINEE_REQUEST_SUCCESS:
      return {
        ...state,
        decisionLoading: false,
        // currentTraining: action.payload,
      };

    case REMOVE_TRAINEE_REQUEST_FAILURE:
      return { ...state, decisionLoading: false, error: action.payload };

    //applicant request edit trainee
    case EDIT_TRAINEE_REQUEST_REQUEST:
      return { ...state, decisionLoading: true, error: null };

    case EDIT_TRAINEE_REQUEST_SUCCESS:
      return {
        ...state,
        decisionLoading: false,
        // currentTraining: action.payload,
      };

    case EDIT_TRAINEE_REQUEST_FAILURE:
      return { ...state, decisionLoading: false, error: action.payload };

    case REQUEST_RESPONSE_REQUEST:
      return { ...state, decisionLoading: true, error: null };

    case REQUEST_RESPONSE_SUCCESS:
      return {
        ...state,
        decisionLoading: false,
        // currentTraining: action.payload,
      };

    case REQUEST_RESPONSE_FAILURE:
      return { ...state, decisionLoading: false, error: action.payload };
    default:
      return state;
  }
};
