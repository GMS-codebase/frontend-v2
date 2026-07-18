import {
  GET_APPLICATIONS_BY_STAGE,
  GET_APPLICANTS_BY_STAGE,
  GET_GENDER_COUNT_BY_STAGE,
  GET_BUSINESS_TYPE_BY_STAGE,
  GET_SUBMISSIONS_BY_SECTOR,
  SET_APPLICATIONS_BY_STAGE_LOADING,
  SET_APPLICANTS_BY_STAGE_LOADING,
  SET_GENDER_COUNT_BY_STAGE_LOADING,
  SET_BUSINESS_TYPE_BY_STAGE_LOADING,
  SET_SUBMISSIONS_BY_SECTOR_LOADING,
  SET_APPLICATIONS_BY_STAGE_ERROR,
  SET_APPLICANTS_BY_STAGE_ERROR,
  SET_GENDER_COUNT_BY_STAGE_ERROR,
  SET_BUSINESS_TYPE_BY_STAGE_ERROR,
  SET_SUBMISSIONS_BY_SECTOR_ERROR,
} from "@/actions/DashboardActions";

const initialState = {
  data: {
    applicationsByStage: {},
    applicantsByStage: {},
    genderCountByStage: {},
    businessTypeByStage: {},
    submissionsBySector: {},
  },
  loading: {
    applicationsByStage: true,
    applicantsByStage: true,
    genderCountByStage: true,
    businessTypeByStage: true,
    submissionsBySector: true,
  },
  error: {
    applicationsByStage: "",
    applicantsByStage: "",
    genderCountByStage: "",
    businessTypeByStage: "",
    submissionsBySector: "",
  },
};

type Action = {
  type: string;
  payload?: any;
};

export default function DashboardReducer(state = initialState, action: Action) {
  switch (action.type) {
    case SET_APPLICATIONS_BY_STAGE_LOADING:
      return {
        ...state,
        loading: { ...state.loading, applicationsByStage: true },
        error: { ...state.error, applicationsByStage: "" },
      };
    case GET_APPLICATIONS_BY_STAGE:
      return {
        ...state,
        loading: { ...state.loading, applicationsByStage: false },
        data: { ...state.data, applicationsByStage: action.payload },
      };
    case SET_APPLICATIONS_BY_STAGE_ERROR:
      return {
        ...state,
        loading: { ...state.loading, applicationsByStage: false },
        error: { ...state.error, applicationsByStage: action.payload },
      };

    case SET_APPLICANTS_BY_STAGE_LOADING:
      return {
        ...state,
        loading: { ...state.loading, applicantsByStage: true },
        error: { ...state.error, applicantsByStage: "" },
      };
    case GET_APPLICANTS_BY_STAGE:
      return {
        ...state,
        loading: { ...state.loading, applicantsByStage: false },
        data: { ...state.data, applicantsByStage: action.payload },
      };
    case SET_APPLICANTS_BY_STAGE_ERROR:
      return {
        ...state,
        loading: { ...state.loading, applicantsByStage: false },
        error: { ...state.error, applicantsByStage: action.payload },
      };

    case SET_GENDER_COUNT_BY_STAGE_LOADING:
      return {
        ...state,
        loading: { ...state.loading, genderCountByStage: true },
        error: { ...state.error, genderCountByStage: "" },
      };
    case GET_GENDER_COUNT_BY_STAGE:
      return {
        ...state,
        loading: { ...state.loading, genderCountByStage: false },
        data: { ...state.data, genderCountByStage: action.payload },
      };
    case SET_GENDER_COUNT_BY_STAGE_ERROR:
      return {
        ...state,
        loading: { ...state.loading, genderCountByStage: false },
        error: { ...state.error, genderCountByStage: action.payload },
      };

    case SET_BUSINESS_TYPE_BY_STAGE_LOADING:
      return {
        ...state,
        loading: { ...state.loading, businessTypeByStage: true },
        error: { ...state.error, businessTypeByStage: "" },
      };
    case GET_BUSINESS_TYPE_BY_STAGE:
      return {
        ...state,
        loading: { ...state.loading, businessTypeByStage: false },
        data: { ...state.data, businessTypeByStage: action.payload },
      };
    case SET_BUSINESS_TYPE_BY_STAGE_ERROR:
      return {
        ...state,
        loading: { ...state.loading, businessTypeByStage: false },
        error: { ...state.error, businessTypeByStage: action.payload },
      };

    case SET_SUBMISSIONS_BY_SECTOR_LOADING:
      return {
        ...state,
        loading: { ...state.loading, submissionsBySector: true },
        error: { ...state.error, submissionsBySector: "" },
      };
    case GET_SUBMISSIONS_BY_SECTOR:
      return {
        ...state,
        loading: { ...state.loading, submissionsBySector: false },
        data: { ...state.data, submissionsBySector: action.payload },
      };
    case SET_SUBMISSIONS_BY_SECTOR_ERROR:
      return {
        ...state,
        loading: { ...state.loading, submissionsBySector: false },
        error: { ...state.error, submissionsBySector: action.payload },
      };

    default:
      return state;
  }
}
