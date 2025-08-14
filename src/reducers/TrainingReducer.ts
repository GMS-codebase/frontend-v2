import { ADD_TRAINING_SUCCESS, UPDATE_TRAINING_SUCCESS } from "@/actions/TrainingActions";

const initialState = {
  trainings: [],
  loading: false,
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
    
    default:
      return state;
  }

};
