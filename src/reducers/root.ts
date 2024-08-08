import { combineReducers } from "redux";
import authReducer from "./AuthReducer";
import WindowsReducer from "./WindowsReducer";
import SectorsReducer from "./SectorsReducer";
import TradesReducer from "./TradesReducer";
import CallsReducer from "./CallsReducer";
const rootReducer = combineReducers({
  auth: authReducer,
  windows: WindowsReducer,
  sectors: SectorsReducer,
  trades: TradesReducer,
  calls: CallsReducer
});

export default rootReducer;
