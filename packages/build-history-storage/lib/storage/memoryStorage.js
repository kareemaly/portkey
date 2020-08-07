const buildHistory = {};

const formatResponse = build => ({
  ...build,
  steps: Object.values(build.steps)
});

module.exports = {
  get: buildId => {
    return formatResponse(buildHistory[buildId]);
  },
  buildStarted: (jobName, buildId) => {
    buildHistory[buildId] = {
      id: buildId,
      jobName,
      startedAt: new Date().getTime(),
      status: "started",
      steps: {}
    };
  },
  buildSuccess: buildId => {
    buildHistory[buildId] = {
      ...buildHistory[buildId],
      startedAt: new Date().getTime(),
      status: "success"
    };
  },
  buildFailure: buildId => {
    buildHistory[buildId] = {
      ...buildHistory[buildId],
      startedAt: new Date().getTime(),
      status: "failure"
    };
  },
  buildStepStarted: (buildId, stepName) => {
    buildHistory[buildId].steps[stepName] = {
      id: stepName,
      name: stepName,
      startedAt: new Date().getTime(),
      status: "started",
      messages: []
    };
  },
  buildStepSuccess: (buildId, stepName) => {
    buildHistory[buildId].steps[stepName] = {
      ...buildHistory[buildId].steps[stepName],
      successAt: new Date().getTime(),
      status: "success"
    };
  },
  buildStepFailure: (buildId, stepName) => {
    buildHistory[buildId].steps[stepName] = {
      ...buildHistory[buildId].steps[stepName],
      failureAt: new Date().getTime(),
      status: "failure"
    };
  },
  addStepMessage: (buildId, stepName, message) => {
    buildHistory[buildId].steps[stepName] = {
      ...buildHistory[buildId].steps[stepName],
      messages: [
        ...buildHistory[buildId].steps[stepName].messages,
        {
          content: message,
          timestamp: new Date().getTime()
        }
      ]
    };
  },
  query: ({ jobName }) => {
    return Object.values(buildHistory)
      .filter(build => build.jobName === jobName)
      .map(formatResponse);
  }
};
