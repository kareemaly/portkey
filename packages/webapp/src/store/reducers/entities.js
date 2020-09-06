import keys from "lodash/keys";
import uniq from "lodash/uniq";
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
  steps: [],
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

function updateEntity(entityName, state, data) {
  return {
    ...state,
    [entityName]: {
      ...state[entityName],
      [data.id]: {
        ...state[entityName][data.id],
        ...data
      }
    }
  };
}

function updateBuild(state, data) {
  return updateEntity("builds", state, {
    ...defaultBuild,
    ...data
  });
}

function addBuildStep(state, buildId, data) {
  const newState = updateEntity("builds", state, {
    id: buildId,
    steps: uniq([...state.builds[buildId].steps, data.id])
  });

  return updateEntity("buildSteps", newState, {
    ...defaultStep,
    ...data
  });
}

export default function entitiesReducer(state = defaultState, action) {
  switch (action.type) {
    case localActions.FETCH_BUILD_SUCCESS:
      const { entities } = normalize(action.payload.data, buildSchema);
      return mergeEntities(state, entities);
    case jobActions.NOTIFY_BUILD_STARTED:
      return updateBuild(state, {
        id: action.payload.buildId,
        startedAt: action.payload.sentAt,
        status: "started"
      });
    case jobActions.NOTIFY_BUILD_SUCCESS:
      return updateBuild(state, {
        id: action.payload.buildId,
        successAt: action.payload.sentAt,
        status: "success"
      });
    case jobActions.NOTIFY_BUILD_FAILURE:
      return updateBuild(state, {
        id: action.payload.buildId,
        failureAt: action.payload.sentAt,
        status: "failure"
      });
    case jobActions.NOTIFY_BUILD_STEP_STARTED:
      return addBuildStep(state, action.payload.buildId, {
        id: action.payload.stepId,
        name: action.payload.stepName,
        startedAt: action.payload.sentAt,
        status: "started"
      });
    case jobActions.NOTIFY_BUILD_STEP_SUCCESS:
      return addBuildStep(state, action.payload.buildId, {
        id: action.payload.stepId,
        name: action.payload.stepName,
        successAt: action.payload.sentAt,
        status: "success"
      });
    case jobActions.NOTIFY_BUILD_STEP_FAILURE:
      return addBuildStep(state, action.payload.buildId, {
        id: action.payload.stepId,
        name: action.payload.stepName,
        failureAt: action.payload.sentAt,
        status: "failure"
      });
    // case outputStreamActions.SEND:
    //   return updateBuildMessage(state, action, {
    //     timestamp: action.payload.sentAt,
    //     message: action.payload.message
    //   });
  }
  return state;
}
