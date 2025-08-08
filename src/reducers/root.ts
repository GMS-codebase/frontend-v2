import { combineReducers } from "redux";
import authReducer from "./AuthReducer";
import WindowsReducer from "./WindowsReducer";
import SectorsReducer from "./SectorsReducer";
import TradesReducer from "./TradesReducer";
import CallsReducer from "./CallsReducer";
import ApplicationsReducer from "./ApplicationsReducer";
import ApplicantsReducer from "./ApplicantsReducer";
import EmployeesReducer from "./EmployeesReducer";
import ContactsReducer from "./ContactsReducer";
import MEReportsReducer from "./MEReportsReducer";
import ProfileReducer from "./ProfileReducer";
import ContractsReducer from "./ContractsReducer";
import EmpStagesReducer from "./EmpStagesReducer";
import MinutesReducer from "./MinutesReducer";
import RolesReducer from "./RolesReducer";
import DashboardReducer from "./DashboardReducer";
import BudgetLinesReducer from "./BudgetLinesReducer";
import announcementsReducer from "./AnnouncementsReducer";
import FormsReducer from "./FormsReducers";
import AppealsReducer from "./AppealsReducer";
import SurveyTraineeReducer from "./SurveyTraineesReducer";
const rootReducer = combineReducers({
  contacts: ContactsReducer,
  auth: authReducer,
  windows: WindowsReducer,
  sectors: SectorsReducer,
  trades: TradesReducer,
  surveyTrainee: SurveyTraineeReducer,
  calls: CallsReducer,
  applications: ApplicationsReducer,
  applicants: ApplicantsReducer,
  employees: EmployeesReducer,
  mereports: MEReportsReducer,
  profile: ProfileReducer,
  contracts: ContractsReducer,
  minutes: MinutesReducer,
  empStages: EmpStagesReducer,
  roles: RolesReducer,
  dashboard: DashboardReducer,
  budgetLines: BudgetLinesReducer,
  announcement: announcementsReducer,
  forms: FormsReducer,
  appeals: AppealsReducer,
});

export default rootReducer;
