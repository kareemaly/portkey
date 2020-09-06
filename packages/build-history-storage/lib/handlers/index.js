const { actions: jobActions } = require("@portkey/job");
const { actions: outputStreamActions } = require("@portkey/job-output-stream");

module.exports = (store, storage) => {
  store.listen(
    jobActions.NOTIFY_BUILD_STARTED,
    {},
    ({ buildId, jobName, sentAt }) => {
      storage.buildStarted(jobName, buildId, sentAt);
    }
  );

  store.listen(jobActions.NOTIFY_BUILD_SUCCESS, {}, ({ buildId, sentAt }) => {
    storage.buildSuccess(buildId, sentAt);
  });

  store.listen(jobActions.NOTIFY_BUILD_FAILURE, {}, ({ buildId, sentAt }) => {
    storage.buildFailure(buildId, sentAt);
  });

  store.listen(outputStreamActions.SEND, {}, ({ buildId, message, sentAt }) => {
    storage.addBuildMessage(buildId, message, sentAt);
  });

  store.listen(
    jobActions.NOTIFY_BUILD_STEP_STARTED,
    {},
    ({ buildId, stepId, stepName, sentAt }) => {
      storage.buildStepStarted(buildId, stepId, stepName, sentAt);
    }
  );

  store.listen(
    jobActions.NOTIFY_BUILD_STEP_SUCCESS,
    {},
    ({ buildId, stepId, stepName, sentAt }) => {
      storage.buildStepSuccess(buildId, stepId, stepName, sentAt);
    }
  );

  store.listen(
    jobActions.NOTIFY_BUILD_STEP_FAILURE,
    {},
    ({ buildId, stepName, stepId, sentAt }) => {
      storage.buildStepFailure(buildId, stepId, stepName, sentAt);
    }
  );
};
