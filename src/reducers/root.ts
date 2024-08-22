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
});

export default rootReducer;
