import { combineReducers } from "redux";
import authReducer from "./AuthReducer";
import WindowsReducer from "./WindowsReducer";
const rootReducer = combineReducers({
  auth: authReducer,
  windows: WindowsReducer
});

export default rootReducer;
