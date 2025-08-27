import {
  GET_CALLS_ERROR,
  GET_CALLS_LOADING,
  GET_CALLS_SUCCESS,
} from "@/actions/CallsActions";
import {
  GET_SECTORS_ERROR,
  GET_SECTORS_LOADING,
  GET_SECTORS_SUCCESS,
} from "@/actions/SectorsActions";
import {
  GET_SECTOR_TRADES_SUCCESS,
  GET_TRADES_ERROR,
  GET_TRADES_LOADING,
  GET_TRADES_SUCCESS,
} from "@/actions/TradesActions";
import {
  GET_SUB_WINDOWS_ERROR,
  GET_SUB_WINDOWS_LOADING,
  GET_SUB_WINDOWS_SUCCESS,
  GET_WINDOWS_ERROR,
  GET_WINDOWS_LOADING,
  GET_WINDOWS_SUCCESS,
} from "@/actions/WindowsActions";
import { Dispatch, UnknownAction } from "redux";
import { authorizedApi, unauthorizedApi } from "@/utils/api";
import {
  GET_APPLICATIONS_ERROR,
  GET_APPLICATIONS_LOADING,
  GET_APPLICATIONS_SUCCESS,
  GET_MY_APPLICATIONS_ERROR,
  GET_MY_APPLICATIONS_LOADING,
  GET_MY_APPLICATIONS_READY_FOR_CONTRACTS_SIGNING_LOADING,
  GET_MY_APPLICATIONS_READY_FOR_CONTRACTS_SIGNING_SUCCESS,
  GET_MY_APPLICATIONS_SUCCESS,
  GET_PAGINATED_APPLICATIONS_LOADING,
  GET_PAGINATED_APPLICATIONS_SUCCESS,
} from "@/actions/ApplicationsActions";
import {
  GET_CONTRACTS_ERROR,
  GET_CONTRACTS_LOADING,
  GET_CONTRACTS_SUCCESS,
  GET_MY_CONTRACTS_ERROR,
  GET_MY_CONTRACTS_LOADING,
  GET_MY_CONTRACTS_SUCCESS,
} from "@/actions/ContractActions";
import {
  GET_EMPLOYEES_ERROR,
  GET_EMPLOYEES_LOADING,
  GET_EMPLOYEES_SUCCESS,
} from "@/actions/EmployeesActions";
import {
  SET_USER_PROFILE,
  SET_USER_ERROR,
  SET_APPLICANT_ERROR,
  SET_APPLICANT_PROFILE,
} from "@/actions/AuthActions";
import {
  GET_MY_CONTACTS_ERROR,
  GET_MY_CONTACTS_LOADING,
  GET_MY_CONTACTS_SUCCESS,
} from "@/actions/ContactsActions";
import {
  GET_MEREPORTS_ERROR,
  GET_MEREPORTS_LOADING,
  GET_MEREPORTS_SUCCESS,
} from "@/actions/MEReportsActions";
import {
  GET_APPLICANT_PROFILE_LOADING,
  GET_APPLICANT_PROFILE_SUCCESS,
  GET_PROFILE_ERROR,
  GET_PROFILE_LOADING,
  GET_PROFILE_SUCCESS,
} from "@/actions/ProfileActions";
import {
  GET_APPLICANTS_ERROR,
  GET_APPLICANTS_LOADING,
  GET_APPLICANTS_SUCCESS,
} from "@/actions/ApplicantsActions";
import {
  GET_STAGES_ERROR,
  GET_STAGES_SUCCESS,
} from "@/actions/EmpStagesActions";
import {
  GET_APPLICATIONS_READY_FOR_MINUTES_LOADING,
  GET_APPLICATIONS_READY_FOR_MINUTES_SUCCESS,
  GET_APPROVED_MINUTES_LOADING,
  GET_APPROVED_MINUTES_SUCCESS,
  GET_MINUTES_ERROR,
  GET_MINUTES_LOADING,
  GET_MINUTES_SUCCESS,
  GET_NEGOTIATED_MINUTES_LOADING,
  GET_NEGOTIATED_MINUTES_SUCCESS,
  GET_REJECTED_MINUTES_LOADING,
  GET_REJECTED_MINUTES_SUCCESS,
  GET_UPLOADED_MINUTES_LOADING,
  GET_UPLOADED_MINUTES_SUCCESS,
} from "@/actions/MinutesActions";
import {
  GET_ROLES_LOADING,
  GET_ROLES_SUCCESS,
  GET_ROLES_ERROR,
} from "@/actions/RolesActions";
import {
  GET_APPLICATIONS_BY_STAGE,
  SET_APPLICATIONS_BY_STAGE_LOADING,
  SET_APPLICATIONS_BY_STAGE_ERROR,
  GET_APPLICANTS_BY_STAGE,
  SET_APPLICANTS_BY_STAGE_LOADING,
  SET_APPLICANTS_BY_STAGE_ERROR,
  GET_GENDER_COUNT_BY_STAGE,
  SET_GENDER_COUNT_BY_STAGE_LOADING,
  SET_GENDER_COUNT_BY_STAGE_ERROR,
  GET_BUSINESS_TYPE_BY_STAGE,
  SET_BUSINESS_TYPE_BY_STAGE_LOADING,
  SET_BUSINESS_TYPE_BY_STAGE_ERROR,
  GET_SUBMISSIONS_BY_SECTOR,
  SET_SUBMISSIONS_BY_SECTOR_LOADING,
  SET_SUBMISSIONS_BY_SECTOR_ERROR,
} from "@/actions/DashboardActions";
import { notifications } from "@mantine/notifications";
import {
  GET_BUDGET_LINES_ERROR,
  GET_BUDGET_LINES_LOADING,
  GET_BUDGET_LINES_SUCCESS,
} from "@/actions/BudgetLinesActions";

import {
  GET_ANNOUNCEMENT_LOADING,
  GET_ANNOUNCEMENT_SUCCESS,
  GET_ANNOUNCEMENT_ERROR,
} from "@/actions/AnnouncementActions";
import {
  GET_FORMS_ERROR,
  GET_FORMS_LOADING,
  GET_FORMS_SUCCESS,
} from "@/actions/FormsActions";
import { Form } from "@/types/questions-form";

import {
  GET_APPEALS_ERROR,
  GET_APPEALS_LOADING,
  GET_APPEALS_SUCCESS,
} from "@/actions/AppealsActions";
import { QuestionForm } from "@/types/questions-form";
import { useRouter } from "next/navigation";
import { ApplicationStage } from "@/types/application";
import {
  GET_SURVEY_TRAINEES_ERROR,
  GET_SURVEY_TRAINEES_LOADING,
  GET_SURVEY_TRAINEES_SUCCESS,
} from "@/actions/SurveyTraineeActions";
import {
  ADD_TRAINEE_REQUEST_FAILURE,
  ADD_TRAINEE_REQUEST_REQUEST,
  ADD_TRAINEE_REQUEST_SUCCESS,
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
} from "@/actions/TrainingActions";

export const exportAppealsReport = async (
  dispatch: Dispatch<UnknownAction>,
  user: string
) => {
  dispatch({ type: GET_APPEALS_LOADING });
  const api =
    user === "applicant" ? "/appeals/all-appeals/mine/all" : "/appeals/all";
  authorizedApi
    .get(api)
    .then((res) => {
      dispatch({ type: GET_APPEALS_SUCCESS, payload: res.data.data.data });
    })
    .catch((err) => {
      dispatch({
        type: GET_APPEALS_ERROR,
        payload:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Unknown error",
      });
    });
};
export const getAppeals = async (
  dispatch: Dispatch<UnknownAction>,
  user: string
) => {
  dispatch({ type: GET_APPEALS_LOADING });
  const api =
    user === "applicant" ? "/appeals/all-appeals/mine/all" : "/appeals/all";
  authorizedApi
    .get(api)
    .then((res) => {
      dispatch({ type: GET_APPEALS_SUCCESS, payload: res.data.data.data });
    })
    .catch((err) => {
      dispatch({
        type: GET_APPEALS_ERROR,
        payload:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Unknown error",
      });
    });
};
export const shortenString = (str: string, maxLength: number = 30) => {
  return str?.length > maxLength ? str?.slice(0, maxLength) + "..." : str;
};
export const getWindows = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_WINDOWS_LOADING });
  authorizedApi
    .get("/window/all")
    .then((res) => {
      dispatch({ type: GET_WINDOWS_SUCCESS, payload: res.data.data.data });
    })
    .catch((err) => {
      dispatch({
        type: GET_WINDOWS_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};
export const getSubWindows = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_SUB_WINDOWS_LOADING });
  authorizedApi
    .get("/sub-window/sub-windows/all")
    .then((res) => {
      dispatch({ type: GET_SUB_WINDOWS_SUCCESS, payload: res.data.data.data });
    })
    .catch((err) => {
      dispatch({
        type: GET_SUB_WINDOWS_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};
export const getMyProfile = async (dispatch: Dispatch<UnknownAction>) => {
  authorizedApi
    .get("/auth/me")
    .then((res) => {
      dispatch({ type: SET_USER_PROFILE, payload: res.data.data }); //Todo: change this only when the BEs change the response schema
    })
    .catch((err) => {
      dispatch({ type: SET_USER_ERROR, payload: err?.response?.data?.error });
    });
};
export const getMyApplicantProfile = async (
  dispatch: Dispatch<UnknownAction>
) => {
  authorizedApi
    .get("/applicant/me")
    .then((res) => {
      dispatch({ type: SET_APPLICANT_PROFILE, payload: res.data.data.data });
    })
    .catch((err) => {
      dispatch({
        type: SET_APPLICANT_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};
export const getSectorTrades = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_SECTORS_LOADING });
  authorizedApi
    .get("/Sectors/sector/trades")
    .then((res) => {
      dispatch({
        type: GET_SECTOR_TRADES_SUCCESS,
        payload: res.data.data.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_SECTORS_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};
export const getSectors = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_SECTORS_LOADING });
  authorizedApi
    .get("/Sectors")
    .then((res) => {
      dispatch({ type: GET_SECTORS_SUCCESS, payload: res.data.data.data });
    })
    .catch((err) => {
      dispatch({
        type: GET_SECTORS_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};
export const getApplicationsByStage = async (
  dispatch: Dispatch<UnknownAction>
) => {
  try {
    dispatch({ type: SET_APPLICATIONS_BY_STAGE_LOADING });
    const response = await authorizedApi.get(`/dashboard/applications`);
    dispatch({ type: GET_APPLICATIONS_BY_STAGE, payload: response.data });
  } catch (err: any) {
    dispatch({
      type: SET_APPLICATIONS_BY_STAGE_ERROR,
      payload: err.response?.error ?? "Network Error",
    });
  }
};

// Fetch applicants by stage
export const getApplicantsByStage = async (
  dispatch: Dispatch<UnknownAction>,
  call: string,
  stage: string
) => {
  try {
    dispatch({ type: SET_APPLICANTS_BY_STAGE_LOADING });
    const response = await authorizedApi.get(
      `/applicants/stage?callUuid=${call}&currentStage=${stage}`
    );
    dispatch({ type: GET_APPLICANTS_BY_STAGE, payload: response.data });
  } catch (err: any) {
    dispatch({
      type: SET_APPLICANTS_BY_STAGE_ERROR,
      payload: err.response?.error ?? "Network Error",
    });
  }
};

// Fetch gender count by stage
export const getGenderCountByStage = async (
  dispatch: Dispatch<UnknownAction>,
  call: string,
  stage: string
) => {
  try {
    dispatch({ type: SET_GENDER_COUNT_BY_STAGE_LOADING });
    const response = await authorizedApi.get(
      `/gender-count/stage?callUuid=${call}&currentStage=${stage}`
    );
    dispatch({ type: GET_GENDER_COUNT_BY_STAGE, payload: response.data });
  } catch (err: any) {
    dispatch({
      type: SET_GENDER_COUNT_BY_STAGE_ERROR,
      payload: err.response?.error ?? "Network Error",
    });
  }
};

// Fetch business type by stage
export const getBusinessTypeByStage = async (
  dispatch: Dispatch<UnknownAction>,
  call: string,
  stage: string
) => {
  try {
    dispatch({ type: SET_BUSINESS_TYPE_BY_STAGE_LOADING });
    const response = await authorizedApi.get(
      `/business-type/stage?callUuid=${call}&currentStage=${stage}`
    );
    dispatch({ type: GET_BUSINESS_TYPE_BY_STAGE, payload: response.data });
  } catch (err: any) {
    dispatch({
      type: SET_BUSINESS_TYPE_BY_STAGE_ERROR,
      payload: err.response?.error ?? "Network Error",
    });
  }
};

// Fetch submissions by sector
export const getSubmissionsBySector = async (
  dispatch: Dispatch<UnknownAction>
) => {
  try {
    dispatch({ type: SET_SUBMISSIONS_BY_SECTOR_LOADING });
    const response = await authorizedApi.get(`/dashboard/submissions/sector`);
    dispatch({ type: GET_SUBMISSIONS_BY_SECTOR, payload: response.data });
  } catch (err: any) {
    dispatch({
      type: SET_SUBMISSIONS_BY_SECTOR_ERROR,
      payload: err.response?.error ?? "Network Error",
    });
  }
};
export const getTrades =
  (page?: any, limit?: any) => async (dispatch: Dispatch<UnknownAction>) => {
    dispatch({ type: GET_TRADES_LOADING });
    authorizedApi
      .get(`/trade?page=${parseInt(page ?? 1)}&limit=${parseInt(limit ?? 10)}`)
      .then((res) => {
        dispatch({ type: GET_TRADES_SUCCESS, payload: res.data });
      })
      .catch((err) => {
        dispatch({
          type: GET_TRADES_ERROR,
          payload: err?.response?.data?.error,
        });
      });
  };

export const getSurveyTrainee = async (dispatch: Dispatch<UnknownAction>, applicantId?: string) => {
  dispatch({ type: GET_SURVEY_TRAINEES_LOADING });
  
  const url = applicantId 
    ? `/survey-trainee?applicantId=${applicantId}`
    : "/survey-trainee";
    
  authorizedApi
    .get(url)
    .then((res) => {
      console.log(res.data.data.data);
      dispatch({
        type: GET_SURVEY_TRAINEES_SUCCESS,
        payload: res.data.data.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_SURVEY_TRAINEES_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};
export const getForms = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_FORMS_LOADING });
  authorizedApi
    .get("/forms/all")
    .then((res) => {
      dispatch({ type: GET_FORMS_SUCCESS, payload: res.data.data.data });
    })
    .catch((err) => {
      dispatch({ type: GET_FORMS_ERROR, payload: err?.response?.data?.error });
    });
};
export const getBudgetLines = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_BUDGET_LINES_LOADING });
  authorizedApi
    .get("/budgetlines/all")
    .then((res) => {
      dispatch({ type: GET_BUDGET_LINES_SUCCESS, payload: res.data.data.data });
    })
    .catch((err) => {
      dispatch({
        type: GET_BUDGET_LINES_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};
export const getCalls = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_CALLS_LOADING });
  authorizedApi
    .get("/call/all")
    .then((res) => {
      dispatch({ type: GET_CALLS_SUCCESS, payload: res.data?.data?.data });
    })
    .catch((err) => {
      dispatch({ type: GET_CALLS_ERROR, payload: err?.response?.data?.error });
    });
};
export const getRoles = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_ROLES_LOADING });
  authorizedApi
    .get("/roles/all-roles")
    .then((res) => {
      dispatch({ type: GET_ROLES_SUCCESS, payload: res.data?.data?.data });
    })
    .catch((err) => {
      dispatch({ type: GET_ROLES_ERROR, payload: err?.response?.data?.error });
    });
};

export const handleDownloadFile = async (file: any, service: string) => {
  try {
    const filename = file.split("/").pop();

    const response = await unauthorizedApi.get(
      `/admin/download/${service}/${encodeURIComponent(filename)}`,
      {
        responseType: "blob",
      }
    );
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "downloaded-file.jpg";
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

export const handleViewFile = (file: string, service: string): void => {
  try {
    const filename = encodeURIComponent(file.split("/").pop() || "");
    const fileUrl = `/files/${service}/${filename}`;
    window.open(fileUrl, "_blank");
  } catch (error) {
    console.error("Error opening file:", error);
  }
};

export const getApplicants =
  (page?: any, limit?: any) => async (dispatch: Dispatch<UnknownAction>) => {
    dispatch({ type: GET_APPLICANTS_LOADING });
    authorizedApi
      .get(
        `/applicant/all?page=${parseInt(page ?? 1)}&limit=${parseInt(limit ?? 10)}`
      )
      .then((res) => {
        dispatch({
          type: GET_APPLICANTS_SUCCESS,
          payload: res.data.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: GET_APPLICANTS_ERROR,
          payload: err?.response?.data?.error,
        });
        dispatch({
          type: GET_APPLICANTS_ERROR,
          payload: err?.response?.data?.error,
        });
      });
  };
export const getContracts = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_CONTRACTS_LOADING });
  authorizedApi
    .get("/negotiation-contract/contracts/sdf/all")
    .then((res) => {
      dispatch({
        type: GET_CONTRACTS_SUCCESS,
        payload: res?.data?.data?.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_CONTRACTS_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};

export const getMinutes = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_MINUTES_LOADING });
  authorizedApi
    .get("/application/contract-signing/all") //Todo: change this to the correct endpoint
    .then((res) => {
      dispatch({
        type: GET_MINUTES_SUCCESS,
        payload: res.data.data.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_MINUTES_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};
export const getEmpStages = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_STAGES_ERROR });
  authorizedApi
    .get("/employees/my/stages")
    .then((res) => {
      dispatch({
        type: GET_STAGES_SUCCESS,
        payload: res.data.data.data,
      });
    })
    .catch((err) => {
      dispatch({ type: GET_STAGES_ERROR, payload: err?.response?.data?.error });
    });
};
export const getApplicationsForContractSigning = async (
  dispatch: Dispatch<UnknownAction>
) => {
  dispatch({ type: GET_MY_APPLICATIONS_READY_FOR_CONTRACTS_SIGNING_LOADING });
  authorizedApi
    .get("/negotiation-contract/applications/sdf/ready-contract-signing")
    .then((res) => {
      dispatch({
        type: GET_MY_APPLICATIONS_READY_FOR_CONTRACTS_SIGNING_SUCCESS,
        payload: res.data.data.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_APPLICATIONS_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};
export const getApplications = async (dispatch: Dispatch) => {
  dispatch({ type: GET_APPLICATIONS_LOADING });

  try {
    const response = await authorizedApi.get(`/application/all/not-paginated`);
    dispatch({
      type: GET_APPLICATIONS_SUCCESS,
      payload: {
        applications: response?.data?.data?.data,
      },
    });
  } catch (error: any) {
    dispatch({
      type: GET_APPLICATIONS_ERROR,
      payload: error.response?.data?.error || "Something went wrong",
    });
  }
};

export const getApplicationsByEmployee = async (dispatch: Dispatch) => {
  dispatch({ type: GET_APPLICATIONS_LOADING });

  try {
    const response = await authorizedApi.get(
      `/application/all/not-paginated/by-employee`
    );
    dispatch({
      type: GET_APPLICATIONS_SUCCESS,
      payload: {
        applications: response?.data?.data?.data,
      },
    });
  } catch (error: any) {
    dispatch({
      type: GET_APPLICATIONS_ERROR,
      payload: error.response?.data?.error || "Something went wrong",
    });
  }
};

export const getApplicationsPaginated =
  (page?: any, limit?: any) => async (dispatch: Dispatch) => {
    dispatch({ type: GET_PAGINATED_APPLICATIONS_LOADING });

    try {
      const response = await authorizedApi.get(
        `/application/all?page=${parseInt(page ?? 1)}&limit=${parseInt(limit ?? 10)}`
      );
      dispatch({
        type: GET_PAGINATED_APPLICATIONS_SUCCESS,
        payload: {
          applications: response?.data?.data?.data.applications,
          total: response?.data?.data?.data.total,
          page: response?.data?.data?.data?.page,
        },
      });
    } catch (error: any) {
      dispatch({
        type: GET_APPLICATIONS_ERROR,
        payload: error.response?.data?.error || "Something went wrong",
      });
    }
  };
export const getEmployeeApplicationsPaginated =
  (page?: any, limit?: any) => async (dispatch: Dispatch) => {
    dispatch({ type: GET_PAGINATED_APPLICATIONS_LOADING });

    try {
      const response = await authorizedApi.get(
        `/application/all/paginated/by-employee?page=${parseInt(page ?? 1)}&limit=${parseInt(limit ?? 10)}`
      );
      dispatch({
        type: GET_PAGINATED_APPLICATIONS_SUCCESS,
        payload: {
          applications: response?.data?.data?.data.data,
          total: response?.data?.data?.data.total,
          page: response?.data?.data?.data?.page,
        },
      });
    } catch (error: any) {
      dispatch({
        type: GET_APPLICATIONS_ERROR,
        payload: error.response?.data?.error || "Something went wrong",
      });
    }
  };
export const getMyApplications =
  (page?: any, limit?: any) => async (dispatch: Dispatch<UnknownAction>) => {
    dispatch({ type: GET_MY_APPLICATIONS_LOADING });
    authorizedApi
      .get(
        `/application/all-application?page=${parseInt(page ?? 1)}&limit=${parseInt(limit ?? 10)}`
      )
      .then((res) => {
        dispatch({
          type: GET_MY_APPLICATIONS_SUCCESS,
          payload: res.data.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: GET_MY_APPLICATIONS_ERROR,
          payload: err?.response?.data?.error,
        });
      });
  };

export const getAnnouncement = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_ANNOUNCEMENT_LOADING });
  authorizedApi
    .get("/announcements")
    .then((res) => {
      dispatch({
        type: GET_ANNOUNCEMENT_SUCCESS,
        payload: res.data.data.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ANNOUNCEMENT_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};

export const getMyContacts = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_MY_CONTACTS_LOADING });
  authorizedApi
    .get("/contacts/mine")
    .then((res) => {
      dispatch({ type: GET_MY_CONTACTS_SUCCESS, payload: res.data.data.data });
    })
    .catch((err) => {
      dispatch({
        type: GET_MY_CONTACTS_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};
export const getMyContracts = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_MY_CONTRACTS_LOADING });
  authorizedApi
    .get("/negotiation-contract/contracts/applicant")
    .then((res) => {
      dispatch({ type: GET_MY_CONTRACTS_SUCCESS, payload: res.data.data.data });
    })
    .catch((err) => {
      dispatch({
        type: GET_MY_CONTRACTS_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};
export const getApplicationsReadyForMinutes = async (
  dispatch: Dispatch<UnknownAction>,
  role: string
) => {
  dispatch({ type: GET_APPLICATIONS_READY_FOR_MINUTES_LOADING });
  authorizedApi
    .get(`/application/contract-signing/all`)
    .then((res) => {
      dispatch({
        type: GET_APPLICATIONS_READY_FOR_MINUTES_SUCCESS,
        payload: res.data.data?.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_MINUTES_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};
export const getUploadedMinutes = async (
  dispatch: Dispatch<UnknownAction>,
  role: string
) => {
  dispatch({ type: GET_UPLOADED_MINUTES_LOADING });
  authorizedApi
    .get(`/negotiation-contract/applications/${role}/pending`)
    .then((res) => {
      dispatch({
        type: GET_UPLOADED_MINUTES_SUCCESS,
        payload: res.data.data?.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_MY_CONTRACTS_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};
export const getApprovedMinutes = async (
  dispatch: Dispatch<UnknownAction>,
  role: string
) => {
  dispatch({ type: GET_APPROVED_MINUTES_LOADING });
  authorizedApi
    .get(`/negotiation-contract/applications/${role}/approved`)
    .then((res) => {
      dispatch({
        type: GET_APPROVED_MINUTES_SUCCESS,
        payload: res.data?.data?.data?.applications ?? res.data?.data?.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_MY_CONTRACTS_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};
export const getRejectedMinutes = async (
  dispatch: Dispatch<UnknownAction>,
  role: string
) => {
  dispatch({ type: GET_REJECTED_MINUTES_LOADING });
  authorizedApi
    .get(`/negotiation-contract/applications/${role}/rejected`)
    .then((res) => {
      dispatch({
        type: GET_REJECTED_MINUTES_SUCCESS,
        payload: res.data.data.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_MY_CONTRACTS_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};
export const getNegotiatedMinutes = async (
  dispatch: Dispatch<UnknownAction>,
  role: string
) => {
  dispatch({ type: GET_NEGOTIATED_MINUTES_LOADING });
  authorizedApi
    .get(
      `/negotiation-contract/applications/${role}/${
        role === "applicant" ? "negotiate" : "negotiating"
      }`
    )
    .then((res) => {
      dispatch({
        type: GET_NEGOTIATED_MINUTES_SUCCESS,
        payload: res.data.data.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_MY_CONTRACTS_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};
export const getEmployees = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_EMPLOYEES_LOADING });
  authorizedApi
    .get("/employees/all")
    .then((res) => {
      dispatch({ type: GET_EMPLOYEES_SUCCESS, payload: res.data.data.data });
    })
    .catch((err) => {
      dispatch({
        type: GET_EMPLOYEES_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};
export const getMEReports = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_MEREPORTS_LOADING });
  authorizedApi
    .get("/report")
    .then((res) => {
      dispatch({ type: GET_MEREPORTS_SUCCESS, payload: res.data.data });
    })
    .catch((err) => {
      dispatch({
        type: GET_MEREPORTS_ERROR,
        payload: err?.response?.data?.error,
      });
    });
};
export const getProfile = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_PROFILE_LOADING });
  authorizedApi
    .get("/auth/me")
    .then((res) => {
      console.log("Getting profile");
      console.log(res.data.data.data);
      dispatch({ type: GET_PROFILE_SUCCESS, payload: res.data?.data?.data });
    })
    .catch((err) => {
      dispatch({
        type: GET_PROFILE_ERROR,
        payload: err?.response?.data?.error ?? "Network Error",
      });
    });
};
export const getApplicantProfile = async (
  dispatch: Dispatch<UnknownAction>
) => {
  dispatch({ type: GET_APPLICANT_PROFILE_LOADING });
  authorizedApi
    .get("/applicant/me")
    .then((res) => {
      dispatch({
        type: GET_APPLICANT_PROFILE_SUCCESS,
        payload: res.data?.data?.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_PROFILE_ERROR,
        payload: err?.response?.data?.error ?? "Network Error",
      });
    });
};
const validateQuestions = async (
  answers: { [key: string]: any },
  form: Form
): Promise<string | null> => {
  try {
    if (!form.qns) {
      return "The form structure is invalid or missing questions.";
    }
    const questionForm: QuestionForm = JSON.parse(form.qns);
    for (const [sectionKey, section] of Object.entries(questionForm)) {
      for (const page of section.pages) {
        for (const question of page.questions) {
          if (question.required) {
            const answer = answers[question.id];
            if (
              answer === undefined ||
              answer === null ||
              (typeof answer === "string" && answer.trim() === "") ||
              (Array.isArray(answer) && answer.length === 0) ||
              (question.type === "file" && typeof answer !== "string")
            ) {
              return `The question "${question.title}" is required but was not answered.`;
            }
          }
        }
      }
    }
    return null;
  } catch (error: any) {
    return `An error occurred during validation: ${error.message}`;
  }
};

const validateComments = async (
  comments: { [key: string]: any },
  form: Form
): Promise<string | null> => {
  try {
    if (!form.qns) {
      return "The form structure is invalid or missing questions.";
    }
    const questionForm: QuestionForm = JSON.parse(form.qns);
    for (const [sectionKey, section] of Object.entries(questionForm)) {
      for (const page of section.pages) {
        for (const question of page.questions) {
          if (question.commentable) {
            const comment = comments[question.id];
            if (
              comment !== undefined &&
              (typeof comment !== "string" || comment.trim() === "")
            ) {
              return `The comment for question "${question.title}" is invalid. Comments should be non-empty strings.`;
            }
          }
        }
      }
    }
    return null;
  } catch (error: any) {
    return `An error occurred during comment validation: ${error.message}`;
  }
};

export const handleSubmit = async (
  type: "submit" | "save",
  setLoading: (type: any) => void,
  answers: any,
  application: any,
  form: any,
  callback?: () => void
) => {
  const error =
    type === "save" ? undefined : await validateQuestions(answers, form);
  if (error !== null && type === "submit") {
    notifications.show({
      message: error,
      color: "red",
    });
    return;
  }
  setLoading(type);
  try {
    await authorizedApi.post(
      `/application/${type === "save" ? "saveApplicationStatus" : "fillApplication"}/${application.uuid}`,
      {
        answers: JSON.stringify(answers),
      }
    );
    notifications.show({
      message:
        type == "save"
          ? "Application drafted successfully"
          : "Application filled successfully!",
      color: "blue",
    });
    setLoading(false);
    callback && callback();
  } catch (err: any) {
    notifications.show({
      message: err.response?.data?.message ?? "Failed to submit the form!",
      color: "red",
    });
  } finally {
    setLoading(null);
  }
};

export const handleAddComments = async (
  action: string,
  comments: any,
  form: any,
  application: any,
  callback?: () => void
) => {
  const error =
    action === "save" ? undefined : await validateComments(comments, form);
  if (error !== null && action === "submit") {
    notifications.show({
      message: error,
      color: "red",
    });
    return;
  }
  console.log("Going to make application");
  try {
    await authorizedApi.patch(
      action === "save"
        ? `/application/draft-comments/${application.uuid}`
        : `/application/comment/${application.uuid}`,
      {
        comments: JSON.stringify(comments),
      }
    );
    notifications.show({
      message: "Comments Added Successfully!",
      color: "blue",
    });
    callback && callback();
  } catch (err: any) {
    notifications.show({
      message: err.response?.data?.message ?? "Failed to submit the form!",
      color: "red",
    });
  }
};

export const getApplicationStatus = (application: any) => {
  if (!application.finishedAnswering && application.call.status == "OPEN") {
    return "ANSWERING";
  }
  if (application.finishedAnswering && application.call.status === "OPEN") {
    return "SUBMITTED";
  } else if (
    application?.currentStage === ApplicationStage.EVALUATION &&
    !application?.call?.closedEvaluation &&
    application?.evaluationDecisions?.length != 3 &&
    !application?.evaluationFinalDecision
  ) {
    return "EVALUATION IN PROGRESS";
  } else if (
    application?.currentStage === ApplicationStage.EVALUATION &&
    !application?.call?.closedEvaluation &&
    (application?.evaluationDecisions?.length == 3 ||
      application?.evaluationFinalDecision)
  ) {
    return "EVALUATION COMPLETED";
  } else if (
    application?.currentStage === ApplicationStage.DUE_DILIGENCY &&
    !application?.call?.closedDueDiligency &&
    application?.duediligencyDecisions?.length < 3
  ) {
    return "DUE DILIGENCY IN PROGRESS";
  } else if (
    application?.currentStage === ApplicationStage.DUE_DILIGENCY &&
    !application?.call?.closedDueDiligency &&
    (application?.duediligencyDecisions?.length == 3 ||
      application?.dueFinalDecision)
  ) {
    return "DUE DILIGENCE COMPLETED";
  } else if (
    application?.currentStage === "GRANT_COMMITTEE" &&
    !application?.call?.closedGrantCommittee
  ) {
    return "GRANT COMMITTEE IN PROGRESS";
  } else if (
    application?.currentStage === "CONTRACT_SIGNING" &&
    (!application?.call?.closedGrantCommittee ||
      !application?.call?.closedDueDiligency ||
      !application?.call?.closedEvaluation)
  ) {
    return "CONTRACT SIGNING IN PROGRESS";
  } else if (
    application?.currentStage === "CONTRACT_SIGNING" &&
    application?.call?.closedGrantCommittee &&
    application?.call?.closedDueDiligency &&
    application?.call?.closedEvaluation &&
    application?.uploadedContract
  ) {
    return "FINISH GRANT PROPOSALS";
  } else {
    return application?.currentStage;
  }
};

export const getApplicationStatus2 = (application: any) => {
  if (!application.finishedAnswering) {
    return "ANSWERING";
  } else {
    return application.currentStage;
  }
};

export const getTrainings = async (dispatch: any) => {
  try {
    dispatch({ type: "FETCH_TRAININGS_REQUEST" });
    const res = await authorizedApi.get("/training/by-applicant");
    dispatch({
      type: "SET_TRAININGS",
      payload: res.data.data.data,
    });
    console.log("Trainings fetched successfully:", res.data.data.data);
  } catch (err) {
    console.error("Failed to fetch trainings:", err);
    dispatch({ type: "SET_TRAININGS", payload: [] });
  }
};

export const getSDFTrainings =
  (page?: any, limit?: any) => async (dispatch: any) => {
    try {
      dispatch({ type: "FETCH_TRAININGS_REQUEST" });
      const res = await authorizedApi.get(
        `/training/all?page=${parseInt(page ?? 1)}&limit=${parseInt(limit ?? 10)}`
      );
      dispatch({
        type: "SET_TRAININGS",
        payload: res.data.data.data,
      });
    } catch (err) {
      dispatch({ type: "SET_TRAININGS", payload: [] });
    }
  };

export const getTrainingById = (id: string) => async (dispatch: any) => {
  try {
    dispatch({ type: FETCH_TRAINING_BY_ID_REQUEST });
    const res = await authorizedApi.get(`/training/${id}`);
    dispatch({
      type: FETCH_TRAINING_BY_ID_SUCCESS,
      payload: res.data.data.data,
    });
  } catch (err: any) {
    dispatch({ type: FETCH_TRAINING_BY_ID_FAILURE, payload: err.message });
  }
};

export const requestTrainingReview = (id: string) => async (dispatch: any) => {
  try {
    dispatch({ type: REQUEST_REVIEW_REQUEST });
    const res = await authorizedApi.put(`/training/request-review/${id}`);
    dispatch({
      type: REQUEST_REVIEW_SUCCESS,
      payload: res.data.data.data,
    });
    notifications.show({
      message: "Request to Review sent successfully!",
      color: "green",
    });
  } catch (err: any) {
    dispatch({ type: REQUEST_REVIEW_FAILURE, payload: err.message });
    notifications.show({
      message: "Failed to send request!",
      color: "red",
    });
  }
};

export const sdfMakeTrainingDecision =
  ({
    trainingId,
    decision,
    message,
  }: {
    trainingId: string;
    decision: string;
    message: string;
  }) =>
  async (dispatch: any) => {
    try {
      dispatch({ type: MAKE_DECISION_REQUEST });
      const res = await authorizedApi.put(
        `/training/make-decision/${trainingId}`,
        { decision, message }
      );
      dispatch({
        type: MAKE_DECISION_SUCCESS,
        payload: res.data.data.data,
      });
      notifications.show({
        message: "Request to Response sent successfully!",
        color: "green",
      });
    } catch (err: any) {
      dispatch({ type: MAKE_DECISION_FAILURE, payload: err.message });
      notifications.show({
        message: "Failed to send response!",
        color: "red",
      });
    }
  };

//sertification services LB
export const requestCertificationReview =
  ({ trainingId, trainees }: { trainingId: string; trainees: string[] }) =>
  async (dispatch: any) => {
    try {
      dispatch({ type: CERTIFICATION_REVIEW_REQUEST });
      const res = await authorizedApi.post(
        `/training/request-certification/${trainingId}`,
        { trainees }
      );
      dispatch({
        type: CERTIFICATION_REVIEW_SUCCESS,
        payload: res.data.data.data,
      });
      notifications.show({
        message: "Certification Request sent successfully!",
        color: "green",
      });
    } catch (err: any) {
      dispatch({ type: CERTIFICATION_REVIEW_FAILURE, payload: err.message });
      notifications.show({
        message: "Failed to send certification request!",
        color: "red",
      });
    }
  };

export const sdfCertificationDecision =
  ({ trainingId, trainees }: { trainingId: string; trainees: string[] }) =>
  async (dispatch: any) => {
    try {
      dispatch({ type: CERTIFICATION_DECISION_REQUEST });
      const res = await authorizedApi.post(
        `/training/certification-decision/${trainingId}`,
        { trainees }
      );
      dispatch({
        type: CERTIFICATION_DECISION_SUCCESS,
        payload: res.data.data.data,
      });
      notifications.show({
        message: "Certification Decision made successfully!",
        color: "green",
      });
    } catch (err: any) {
      dispatch({ type: CERTIFICATION_DECISION_FAILURE, payload: err.message });
      notifications.show({
        message: "Failed to make certification decision!",
        color: "red",
      });
    }
  };

export const requestAddTrainee =
  ({
    trainingId,
    numberOfTrainees,
    reason,
  }: {
    trainingId: string;
    numberOfTrainees: number;
    reason: string;
  }) =>
  async (dispatch: any) => {
    try {
      dispatch({ type: ADD_TRAINEE_REQUEST_REQUEST });
      const res = await authorizedApi.post(
        `/training/${trainingId}/trainees/request-add`,
        { numberOfTrainees, reason }
      );
      dispatch({
        type: ADD_TRAINEE_REQUEST_SUCCESS,
        payload: res.data.data.data,
      });
      notifications.show({
        message: "Trainee Request sent successfully!",
        color: "green",
      });
    } catch (err: any) {
      dispatch({ type: ADD_TRAINEE_REQUEST_FAILURE, payload: err.message });
      notifications.show({
        message: "Failed to send trainee add request!",
        color: "red",
      });
    }
  };

export const requestEditTrainee =
  ({ trainingId, traineeIds }: { trainingId: string; traineeIds: string[] }) =>
  async (dispatch: any) => {
    try {
      dispatch({ type: EDIT_TRAINEE_REQUEST_REQUEST });
      const res = await authorizedApi.post(
        `/training/${trainingId}/trainees/request-edit`,
        { traineeIds }
      );
      dispatch({
        type: EDIT_TRAINEE_REQUEST_SUCCESS,
        payload: res.data.data.data,
      });
      notifications.show({
        message: "Trainee Edit Request sent successfully!",
        color: "green",
      });
    } catch (err: any) {
      dispatch({ type: EDIT_TRAINEE_REQUEST_FAILURE, payload: err.message });
      notifications.show({
        message: "Failed to send trainee Edit Request!",
        color: "red",
      });
    }
  };

export const requestRemoveTrainee =
  ({
    trainingId,
    traineeIds,
    reason,
  }: {
    trainingId: string;
    traineeIds: string[];
    reason: string;
  }) =>
  async (dispatch: any) => {
    try {
      dispatch({ type: REMOVE_TRAINEE_REQUEST_REQUEST });
      const res = await authorizedApi.post(
        `/training/${trainingId}/trainees/request-remove`,
        { traineeIds, reason }
      );
      dispatch({
        type: REMOVE_TRAINEE_REQUEST_SUCCESS,
        payload: res.data.data.data,
      });
      notifications.show({
        message: "Trainee Remove Request sent successfully!",
        color: "green",
      });
    } catch (err: any) {
      dispatch({ type: REMOVE_TRAINEE_REQUEST_FAILURE, payload: err.message });
      notifications.show({
        message: "Failed to send trainee Remove Request!",
        color: "red",
      });
    }
  };

export const makeTraineeActionRequestDecision =
  (requestId: string, decision: "APPROVE" | "REJECT", message: string) =>
  async (dispatch: any) => {
    try {
      dispatch({ type: REQUEST_RESPONSE_REQUEST });

      const res = await authorizedApi.post(
        `/training/trainees/request/${requestId}/make-decision`,
        { decision, message }
      );

      dispatch({
        type: REQUEST_RESPONSE_SUCCESS,
        payload: res.data.data,
      });

      notifications.show({
        message: `Request ${decision.toLowerCase()}d successfully!`,
        color: "green",
      });
    } catch (err: any) {
      dispatch({ type: REQUEST_RESPONSE_FAILURE, payload: err.message });
      notifications.show({
        message: "Failed to make decision!",
        color: "red",
      });
    }
  };

// Export the new survey API function
export { getApplicantApplicationsInfo } from "./api/survey";
