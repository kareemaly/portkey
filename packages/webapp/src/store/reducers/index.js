import { combineReducers } from "redux";
import buildsReducer from "./builds";

export default combineReducers({
  builds: buildsReducer
});
