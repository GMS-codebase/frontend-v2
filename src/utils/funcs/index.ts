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
import { authorizedApi, unauthorizedApi } from "../api";
import {
  GET_APPLICATIONS_ERROR,
  GET_APPLICATIONS_LOADING,
  GET_APPLICATIONS_SUCCESS,
  GET_MY_APPLICATIONS_ERROR,
  GET_MY_APPLICATIONS_LOADING,
  GET_MY_APPLICATIONS_READY_FOR_CONTRACTS_SIGNING_SUCCESS,
  GET_MY_APPLICATIONS_SUCCESS,
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
  GET_MINUTES_ERROR,
  GET_MINUTES_LOADING,
  GET_MINUTES_SUCCESS,
} from "@/actions/MinutesActions";
import {
  GET_ROLES_LOADING,
  GET_ROLES_SUCCESS,
  GET_ROLES_ERROR,
} from "@/actions/RolesActions";
export const getWindows = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_WINDOWS_LOADING });
  authorizedApi
    .get("/window/all")
    .then((res) => {
      dispatch({ type: GET_WINDOWS_SUCCESS, payload: res.data.data.data });
    })
    .catch((err) => {
      dispatch({ type: GET_WINDOWS_ERROR, payload: err.response.data.error });
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
        payload: err.response.data.error,
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
      dispatch({ type: SET_USER_ERROR, payload: err.response.data.error });
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
      dispatch({ type: SET_APPLICANT_ERROR, payload: err.response.data.error });
    });
};
export const getSectors = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_SECTORS_LOADING });
  authorizedApi
    .get("/Sectors")
    .then((res) => {
      console.log(res.data.data.data);
      dispatch({ type: GET_SECTORS_SUCCESS, payload: res.data.data.data });
    })
    .catch((err) => {
      dispatch({ type: GET_SECTORS_ERROR, payload: err.response.data.error });
    });
};

export const getSectorTrades = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_SECTORS_LOADING });
  authorizedApi
    .get("/Sectors/sector/trades")
    .then((res) => {
      console.log(res.data.data.data);
      dispatch({
        type: GET_SECTOR_TRADES_SUCCESS,
        payload: res.data.data.data,
      });
    })
    .catch((err) => {
      dispatch({ type: GET_SECTORS_ERROR, payload: err.response.data.error });
    });
};

export const getTrades = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_TRADES_LOADING });
  authorizedApi
    .get("/trade")
    .then((res) => {
      dispatch({ type: GET_TRADES_SUCCESS, payload: res.data.data });
    })
    .catch((err) => {
      dispatch({ type: GET_TRADES_ERROR, payload: err.response.data.error });
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
      dispatch({ type: GET_CALLS_ERROR, payload: err.response.data.error });
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
      dispatch({ type: GET_ROLES_ERROR, payload: err.response.data.error });
    });
};

export const handleDownloadFile = async (file: any, service: string) => {
  try {
    console.log("attachment --> ", file);
    const filename = file.split("/").pop();
    console.log(filename);
    const response = await unauthorizedApi.get(
      `/admin/download/${service}/${filename}`,
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

export const getApplicants = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_APPLICANTS_LOADING });
  authorizedApi
    .get("/applicant/all")
    .then((res) => {
      dispatch({
        type: GET_APPLICANTS_SUCCESS,
        payload: res.data.data.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_APPLICANTS_ERROR,
        payload: err.response.data.error,
      });
      dispatch({
        type: GET_APPLICANTS_ERROR,
        payload: err.response.data.error,
      });
    });
};
export const getContracts = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_CONTRACTS_LOADING });
  authorizedApi
    .get("/contracts")
    .then((res) => {
      dispatch({
        type: GET_CONTRACTS_SUCCESS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch({ type: GET_CONTRACTS_ERROR, payload: err.response.data.error });
    });
};

export const getMinutes = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_MINUTES_LOADING });
  authorizedApi
    .get("/contracts/negotiations/docs/all")
    .then((res) => {
      dispatch({
        type: GET_MINUTES_SUCCESS,
        payload: res.data.data.data,
      });
    })
    .catch((err) => {
      dispatch({ type: GET_MINUTES_ERROR, payload: err.response.data.error });
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
      dispatch({ type: GET_STAGES_ERROR, payload: err.response.data.error });
    });
};
export const getApplicationsForContracts = async (
  dispatch: Dispatch<UnknownAction>
) => {
  dispatch({ type: GET_APPLICATIONS_LOADING });
  authorizedApi
    .get("/application/contract-signing/all")
    .then((res) => {
      dispatch({
        type: GET_MY_APPLICATIONS_READY_FOR_CONTRACTS_SIGNING_SUCCESS,
        payload: res.data.data.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_APPLICATIONS_ERROR,
        payload: err.response.data.error,
      });
    });
};
export const getApplications = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_APPLICATIONS_LOADING });
  authorizedApi
    .get("/application/all")
    .then((res) => {
      dispatch({ type: GET_APPLICATIONS_SUCCESS, payload: res.data.data.data });
    })
    .catch((err) => {
      dispatch({
        type: GET_APPLICATIONS_ERROR,
        payload: err.response.data.error,
      });
    });
};
export const getMyApplications = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_MY_APPLICATIONS_LOADING });
  authorizedApi
    .get("/application/all-application")
    .then((res) => {
      console.log(res.data.data);
      dispatch({
        type: GET_MY_APPLICATIONS_SUCCESS,
        payload: res.data.data.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: GET_MY_APPLICATIONS_ERROR,
        payload: err.response.data.error,
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
        payload: err.response.data.error,
      });
    });
};
export const getMyContracts = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_MY_CONTRACTS_LOADING });
  authorizedApi
    .get("/application/all-application")
    .then((res) => {
      dispatch({ type: GET_MY_CONTRACTS_SUCCESS, payload: res.data.data });
    })
    .catch((err) => {
      dispatch({
        type: GET_MY_CONTRACTS_ERROR,
        payload: err.response.data.error,
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
      dispatch({ type: GET_EMPLOYEES_ERROR, payload: err.response.data.error });
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
        payload: err.response.data.error,
      });
    });
};
export const getProfile = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_PROFILE_LOADING });
  authorizedApi
    .get("/auth/me")
    .then((res) => {
      dispatch({ type: GET_PROFILE_SUCCESS, payload: res.data?.data?.data });
    })
    .catch((err) => {
      dispatch({
        type: GET_PROFILE_ERROR,
        payload: err.response.data.error ?? "Network Error",
      });
    });
};
