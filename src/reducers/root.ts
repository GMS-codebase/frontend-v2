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
import ApplicationsReducer from "./ApplicationsReducer";
import MEReportsReducer from "./MEReportsReducer";
import ProfileReducer from "./ProfileReducer";
const rootReducer = combineReducers({
  contacts: ContactsReducer,
  auth: authReducer,
  windows: WindowsReducer,
  sectors: SectorsReducer,
  trades: TradesReducer,
  calls: CallsReducer,
  applications: ApplicationsReducer,
  applicants: ApplicantsReducer,
  employees: EmployeesReducer,
  applications: ApplicationsReducer,
  mereports: MEReportsReducer,
  profile: ProfileReducer,
});

export default rootReducer;
