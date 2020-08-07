import { compose, createStore } from "redux";
import reducers from "./reducers";
import io from "../api/socketIO";
import DevTools from "../components/DevTools";

const enhancer = compose(
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument()
);

export default function createAppStore() {
  const store = createStore(reducers, {}, enhancer);

  return store;
}
