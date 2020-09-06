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
      [data.id]: data
    }
  };
}

function updateBuild(state, build) {
  return updateEntity("builds", state, {
    ...defaultBuild,
    ...state.builds[build.id],
    ...build
  });
}

function addBuildStep(state, build, step) {
  const newState = updateBuild(state, {
    ...build,
    steps: uniq([...state.builds[build.id].steps, step.id])
  });

  return updateEntity("buildSteps", newState, {
    ...defaultStep,
    ...state.buildSteps[step.id],
    ...step
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
        status: "started",
        jobName: action.payload.jobName
      });
    case jobActions.NOTIFY_BUILD_SUCCESS:
      return updateBuild(state, {
        id: action.payload.buildId,
        successAt: action.payload.sentAt,
        status: "success",
        jobName: action.payload.jobName
      });
    case jobActions.NOTIFY_BUILD_FAILURE:
      return updateBuild(state, {
        id: action.payload.buildId,
        failureAt: action.payload.sentAt,
        status: "failure",
        jobName: action.payload.jobName
      });
    case jobActions.NOTIFY_BUILD_STEP_STARTED:
      return addBuildStep(
        state,
        {
          id: action.payload.buildId,
          jobName: action.payload.jobName
        },
        {
          id: action.payload.stepId,
          name: action.payload.stepName,
          startedAt: action.payload.sentAt,
          status: "started"
        }
      );
    case jobActions.NOTIFY_BUILD_STEP_SUCCESS:
      return addBuildStep(
        state,
        {
          id: action.payload.buildId,
          jobName: action.payload.jobName
        },
        {
          id: action.payload.stepId,
          name: action.payload.stepName,
          successAt: action.payload.sentAt,
          status: "success"
        }
      );
    case jobActions.NOTIFY_BUILD_STEP_FAILURE:
      return addBuildStep(
        state,
        {
          id: action.payload.buildId,
          jobName: action.payload.jobName
        },
        {
          id: action.payload.stepId,
          name: action.payload.stepName,
          failureAt: action.payload.sentAt,
          status: "failure"
        }
      );
    case outputStreamActions.SEND:
      return updateBuild(state, {
        id: action.payload.buildId,
        messages: [
          ...state.builds[action.payload.buildId].messages,
          {
            timestamp: action.payload.sentAt,
            message: action.payload.message
          }
        ]
      });
  }
  return state;
}
