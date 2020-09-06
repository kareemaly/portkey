import keys from "lodash/keys";
import { normalize } from "normalizr";
import { actions as jobActions } from "@portkey/job";
import { actions as outputStreamActions } from "@portkey/job-output-stream";
import * as localActions from "../actions";
import { buildSchema } from "./schemas";

const defaultState = {
  builds: {},
  buildSteps: {},
  jobs: {}
};

const defaultBuild = {
  stepIds: [],
  messages: []
};

const defaultStep = {};

const mergeEntities = (e1, e2) =>
  keys(defaultState).reduce(
    (acc, key) => ({
      ...acc,
      [key]: {
        ...e1[key],
        ...e2[key]
      }
    }),
    {}
  );
export default function entitiesReducer(state = defaultState, action) {
  switch (action.type) {
    case localActions.FETCH_BUILD_SUCCESS:
      const { entities } = normalize(action.payload.data, buildSchema);
      console.log("entities", entities);
      return mergeEntities(state, entities);
    // case jobActions.NOTIFY_BUILD_STARTED:
    //   return updateBuild(state, action, {
    //     id: action.payload.buildId,
    //     startedAt: action.payload.sentAt,
    //     status: "started"
    //   });
    // case jobActions.NOTIFY_BUILD_SUCCESS:
    //   return updateBuild(state, action, {
    //     id: action.payload.buildId,
    //     successAt: action.payload.sentAt,
    //     status: "success"
    //   });
    // case jobActions.NOTIFY_BUILD_FAILURE:
    //   return updateBuild(state, action, {
    //     id: action.payload.buildId,
    //     failureAt: action.payload.sentAt,
    //     status: "failure"
    //   });
    // case jobActions.NOTIFY_BUILD_STEP_STARTED:
    //   return updateBuildStep(state, action, {
    //     id: action.payload.stepName,
    //     name: action.payload.stepName,
    //     startedAt: action.payload.sentAt,
    //     status: "started"
    //   });
    // case jobActions.NOTIFY_BUILD_STEP_SUCCESS:
    //   return updateBuildStep(state, action, {
    //     id: action.payload.stepName,
    //     name: action.payload.stepName,
    //     successAt: action.payload.sentAt,
    //     status: "success"
    //   });
    // case jobActions.NOTIFY_BUILD_STEP_FAILURE:
    //   return updateBuildStep(state, action, {
    //     id: action.payload.stepName,
    //     name: action.payload.stepName,
    //     failureAt: action.payload.sentAt,
    //     status: "failure"
    //   });
    // case outputStreamActions.SEND:
    //   return updateBuildMessage(state, action, {
    //     timestamp: action.payload.sentAt,
    //     message: action.payload.message
    //   });
  }
  return state;
}
