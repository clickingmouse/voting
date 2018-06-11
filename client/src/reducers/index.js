import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
  // "auth" can be named whatever we want
  //  from component, call this.props.auth
  auth: authReducer,
  errors: errorReducer
});
