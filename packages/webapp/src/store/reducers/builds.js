import get from "lodash/get";
import { actions as jobActions } from "@portkey/job";
import { actions as outputStreamActions } from "@portkey/job-output-stream";
import * as localActions from "../actions";

const defaultBuild = {
  steps: []
};

const defaultStep = {
  messages: []
};

const updateArray = (array, id, payload) => {
  if (!array) {
    return [payload];
  }
  const i = array.findIndex(i => i.id === id);
  if (i < 0) {
    return [...array, payload];
  } else {
    return [
      ...array.slice(0, i),
      {
        ...array[i],
        ...payload
      },
      ...array.slice(i + 1)
    ];
  }
};

const updateBuild = (state, action, payload) => {
  return {
    ...state,
    data: {
      ...state.data,
      [action.payload.jobName]: updateArray(
        state.data[action.payload.jobName],
        action.payload.buildId,
        { ...defaultBuild, ...payload }
      )
    }
  };
};

const updateBuildStep = (state, action, payload) => {
  const newStep = {
    ...defaultStep,
    ...payload
  };
  const build = get(state, ["data", action.payload.jobName], []).find(
    b => b.id === action.payload.buildId
  );
  if (!build) {
    return updateBuild(state, action, { steps: [newStep] });
  }
  const steps = updateArray(build.steps, action.payload.stepName, newStep);
  return updateBuild(state, action, { steps });
};

const updateBuildStepMessage = (state, action, payload) => {
  const builds = get(state, ["data", action.payload.jobName], []);
  const build = builds.find(b => b.id === action.payload.buildId);
  const step = get(build, "steps", []).find(
    s => s.name === action.payload.stepName
  );
  const messages = [...get(step, "messages", []), payload];
  return updateBuildStep(state, action, { messages });
};

const defaultState = {
  data: {}
};

export default function buildsReducer(state = defaultState, action) {
  switch (action.type) {
    case localActions.FETCH_BUILD_SUCCESS:
      return updateBuild(state, action, action.payload.data);
    case jobActions.NOTIFY_BUILD_STARTED:
      return updateBuild(state, action, {
        id: action.payload.buildId,
        startedAt: new Date().getTime(),
        status: "started"
      });
    case jobActions.NOTIFY_BUILD_SUCCESS:
      return updateBuild(state, action, {
        id: action.payload.buildId,
        successAt: new Date().getTime(),
        status: "success"
      });
    case jobActions.NOTIFY_BUILD_FAILURE:
      return updateBuild(state, action, {
        id: action.payload.buildId,
        failureAt: new Date().getTime(),
        status: "failure"
      });
    case jobActions.NOTIFY_BUILD_STEP_STARTED:
      return updateBuildStep(state, action, {
        id: action.payload.stepName,
        name: action.payload.stepName,
        startedAt: new Date().getTime(),
        status: "started"
      });
    case jobActions.NOTIFY_BUILD_STEP_SUCCESS:
      return updateBuildStep(state, action, {
        id: action.payload.stepName,
        name: action.payload.stepName,
        successAt: new Date().getTime(),
        status: "success"
      });
    case jobActions.NOTIFY_BUILD_STEP_FAILURE:
      return updateBuildStep(state, action, {
        id: action.payload.stepName,
        name: action.payload.stepName,
        failureAt: new Date().getTime(),
        status: "failure"
      });
    case outputStreamActions.SEND:
      return updateBuildStepMessage(state, action, {
        timestamp: new Date().getTime(),
        content: action.payload.message
      });
  }
  return state;
}
