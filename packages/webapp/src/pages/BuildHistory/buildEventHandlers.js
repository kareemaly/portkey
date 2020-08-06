import { actions as jobActions } from "@portkey/job";

const updateArray = (array, id, payload) => {
  const i = array.findIndex(i => i.id === id);
  if (i < 0) {
    return [...array, { id, ...payload }];
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

export default function buildEventHandlers(activeJobName, setBuilds) {
  const updateBuild = (id, payload) =>
    setBuilds(array => updateArray(array, id, payload));
  const updateBuildStep = (buildId, stepId, payload) =>
    setBuilds(builds => {
      const build = builds.find(i => i.id === buildId);
      const steps = updateArray(build.steps, stepId, payload);
      return updateArray(builds, buildId, { steps });
    });
  return {
    [jobActions.NOTIFY_BUILD_STARTED]: ({ jobName, buildId }) => {
      if (jobName !== activeJobName) return;
      updateBuild(buildId, {
        startedAt: new Date().getTime(),
        status: "started",
        steps: []
      });
    },
    [jobActions.NOTIFY_BUILD_SUCCESS]: ({ jobName, buildId }) => {
      if (jobName !== activeJobName) return;
      updateBuild(buildId, {
        successAt: new Date().getTime(),
        status: "success"
      });
    },
    [jobActions.NOTIFY_BUILD_FAILURE]: ({ jobName, buildId }) => {
      if (jobName !== activeJobName) return;
      updateBuild(buildId, {
        failureAt: new Date().getTime(),
        status: "failure"
      });
    },
    [jobActions.NOTIFY_BUILD_STEP_STARTED]: ({
      jobName,
      buildId,
      stepName
    }) => {
      if (jobName !== activeJobName) return;
      updateBuildStep(buildId, stepName, {
        name: stepName,
        startedAt: new Date().getTime(),
        status: "started"
      });
    },
    [jobActions.NOTIFY_BUILD_STEP_SUCCESS]: ({
      jobName,
      buildId,
      stepName
    }) => {
      if (jobName !== activeJobName) return;
      updateBuildStep(buildId, stepName, {
        successAt: new Date().getTime(),
        status: "success"
      });
    },
    [jobActions.NOTIFY_BUILD_STEP_FAILURE]: ({
      jobName,
      buildId,
      stepName
    }) => {
      if (jobName !== activeJobName) return;
      updateBuildStep(buildId, stepName, {
        failureAt: new Date().getTime(),
        status: "failure"
      });
    }
  };
}
