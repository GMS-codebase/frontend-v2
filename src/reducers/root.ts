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
  mereports: MEReportsReducer,
  profile: ProfileReducer,
  contracts: ContractsReducer,
});

export default rootReducer;
