import { createStore } from "redux";
import reducers from "./reducers";
import io from "../api/socketIO";

export default function createAppStore() {
  const store = createStore(
    reducers,
    {},
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
}
