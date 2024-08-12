import { combineReducers } from "redux";
import authReducer from "./AuthReducer";
import WindowsReducer from "./WindowsReducer";
import SectorsReducer from "./SectorsReducer";
import TradesReducer from "./TradesReducer";
import CallsReducer from "./CallsReducer";
import ApplicantsReducer from "./ApplicantsReducer";
import EmployeesReducer from "./EmployeesReducer";
const rootReducer = combineReducers({
  auth: authReducer,
  windows: WindowsReducer,
  sectors: SectorsReducer,
  trades: TradesReducer,
  calls: CallsReducer,
  applicants: ApplicantsReducer,
  employees: EmployeesReducer,
});

export default rootReducer;
