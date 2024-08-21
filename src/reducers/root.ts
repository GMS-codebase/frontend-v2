import { combineReducers } from "redux";
import authReducer from "./AuthReducer";
import WindowsReducer from "./WindowsReducer";
import SectorsReducer from "./SectorsReducer";
import TradesReducer from "./TradesReducer";
import CallsReducer from "./CallsReducer";
import ApplicantsReducer from "./ApplicantsReducer";
import EmployeesReducer from "./EmployeesReducer";
import ApplicationsReducer from "./ApplicationsReducer";
import MEReportsReducer from "./MEReportsReducer";
import ProfileReducer from "./ProfileReducer";
const rootReducer = combineReducers({
  auth: authReducer,
  windows: WindowsReducer,
  sectors: SectorsReducer,
  trades: TradesReducer,
  calls: CallsReducer,
  applicants: ApplicantsReducer,
  employees: EmployeesReducer,
  applications: ApplicationsReducer,
  mereports: MEReportsReducer,
  profile: ProfileReducer,
});

export default rootReducer;
