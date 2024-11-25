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
  GET_APPLICATIONS_READY_FOR_MINUTES_LOADING,
  GET_APPLICATIONS_READY_FOR_MINUTES_SUCCESS,
  GET_APPROVED_MINUTES_LOADING,
  GET_APPROVED_MINUTES_SUCCESS,
  GET_MINUTES_ERROR,
  GET_MINUTES_LOADING,
  GET_MINUTES_SUCCESS,
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
  GET_DASHBOARD_ERROR,
  GET_DASHBOARD_LOADING,
  GET_DASHBOARD_SUCCESS,
  GET_PRIORITY_SECTORS_DATA,
} from "@/actions/DashboardActions";
import { prioritySectors } from "../constants";
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
import { Form } from "@/types";
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
      dispatch({ type: GET_SECTORS_ERROR, payload: err.response.data.error });
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
      dispatch({ type: GET_SECTORS_ERROR, payload: err.response.data.error });
    });
};
export const getDashboardData = async (
  dispatch: Dispatch<UnknownAction>,
  call: string,
  stage: string
) => {
  try {
    dispatch({ type: GET_DASHBOARD_LOADING });
    const dashboardResponse = await authorizedApi.get(
      `/application/dashboard1?callUuid=${call}&currentStage=${stage}`
    );
    dispatch({ type: GET_DASHBOARD_SUCCESS, payload: dashboardResponse.data });
    for (const sector of prioritySectors) {
      try {
        const sectorResponse = await authorizedApi.get(
          `/Sectors/${sector?.id}/count/applications/count/applicants`
        );
        dispatch({
          type: GET_PRIORITY_SECTORS_DATA,
          payload: {
            sectorName: sector.sector,
            data: sectorResponse.data.data.data,
          },
        });
      } catch (err: any) {
        dispatch({
          type: GET_DASHBOARD_ERROR,
          payload: err.response?.error ?? "Network Error",
        });
      }
    }
  } catch (err: any) {
    dispatch({
      type: GET_DASHBOARD_ERROR,
      payload: err.response?.error ?? "Network Error",
    });
  }
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
export const getForms = async (dispatch: Dispatch<UnknownAction>) => {
  dispatch({ type: GET_FORMS_LOADING });
  authorizedApi
    .get("/forms/all")
    .then((res) => {
      dispatch({ type: GET_FORMS_SUCCESS, payload: res.data.data.data });
    })
    .catch((err) => {
      dispatch({ type: GET_FORMS_ERROR, payload: err.response.data.error });
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
        payload: err.response.data.error,
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
    .get("/negotiation-contract/contracts/sdf/all")
    .then((res) => {
      dispatch({
        type: GET_CONTRACTS_SUCCESS,
        payload: res?.data?.data?.data,
      });
    })
    .catch((err) => {
      dispatch({ type: GET_CONTRACTS_ERROR, payload: err.response.data.error });
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
export const getApplicationsForContractSigning = async (
  dispatch: Dispatch<UnknownAction>
) => {
  dispatch({ type: GET_APPLICATIONS_LOADING });
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
      dispatch({
        type: GET_MY_APPLICATIONS_SUCCESS,
        payload: res.data.data.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_MY_APPLICATIONS_ERROR,
        payload: err.response.data.error,
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
        payload: err.response.data.error,
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
        payload: err.response.data.error,
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
        payload: res.data?.data?.data?.applications,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_MY_CONTRACTS_ERROR,
        payload: err.response.data.error,
      });
    });
};
export const getRejectedMinutes = async (
  dispatch: Dispatch<UnknownAction>,
  role: string
) => {
  dispatch({ type: GET_REJECTED_MINUTES_LOADING });
  authorizedApi
    .get("/negotiation-contract/applications/rejected")
    .then((res) => {
      dispatch({
        type: GET_REJECTED_MINUTES_SUCCESS,
        payload: res.data.data.data,
      });
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

const validateQuestions = async (
  answers: any,
  form: Form
): Promise<string | null> => {
  return null;
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
  console.log(answers)
  // setLoading(type);
  // try {
  //   await authorizedApi.post(
  //     `/application/${type === "save" ? "saveApplicationStatus" : "fillApplication"}/${application.uuid}`,
  //     {
  //       answers: JSON.stringify(answers),
  //     }
  //   );
  //   console.log(answers);
  //   notifications.show({
  //     message:
  //       type == "save"
  //         ? "Application drafted successfully"
  //         : "Application filled successfully!",
  //     color: "blue",
  //   });
  //   setLoading(false);
  //   // callback && callback();
  // } catch (err: any) {
  //   notifications.show({
  //     message: err.response?.data?.message ?? "Failed to submit the form!",
  //     color: "red",
  //   });
  // } finally {
  //   setLoading(null);
  // }
};

const validateComments = async (
  comments: any,
  form: any
): Promise<string | null> => {
  return null;
};

export const handleAddComments = async (
  comments: any,
  form: any,
  application: any,
  callback?: () => void
) => {
  const validationError = await validateComments(comments, form);
  if (validationError) {
    notifications.show({
      message: validationError,
      color: "red",
    });
    return;
  }
  try {
    await authorizedApi.patch(`/application/comment/${application.uuid}`, {
      comments: JSON.stringify(comments),
    });
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
  if (!application.finishedAnswering) {
    return "ANSWERING";
  } else if (
    application?.currentStage === "EVALUATION" &&
    !application?.call?.closedEvaluation
  ) {
    return "EVALUATION IN PROGRESS";
  } else if (
    application?.currentStage === "DUE_DILIGENCY" &&
    !application?.call?.closedDueDiligency
  ) {
    return "DUE DILIGENCY IN  PROGRESS";
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
  } else {
    return application?.currentStage;
  }
};
