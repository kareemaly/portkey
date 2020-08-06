const { actions: jobActions } = require("@portkey/job");
const { actions: outputStreamActions } = require("@portkey/job-output-stream");
const actions = require("../actions");

module.exports = (store, storage) => {
  const wrapper = async (buildId, fn) => {
    try {
      store.dispatch(
        actions.storeBuildStarted({
          buildId
        })
      );
      await fn();
      store.dispatch(
        actions.storeBuildSuccess({
          buildId
        })
      );
    } catch (error) {
      store.dispatch(
        actions.storeBuildFailure({
          buildId,
          error
        })
      );
    }
  };

  store.listen(jobActions.NOTIFY_BUILD_STARTED, {}, ({ buildId, jobName }) => {
    wrapper(buildId, () => storage.buildStarted(jobName, buildId));
  });

  store.listen(jobActions.NOTIFY_BUILD_SUCCESS, {}, async ({ buildId }) => {
    wrapper(buildId, () => storage.buildSuccess(buildId));
  });

  store.listen(jobActions.NOTIFY_BUILD_FAILURE, {}, async ({ buildId }) => {
    wrapper(buildId, () => storage.buildFailure(buildId));
  });

  store.listen(
    outputStreamActions.SEND,
    {},
    ({ buildId, stepName, message }) => {
      wrapper(buildId, () =>
        storage.addStepMessage(buildId, stepName, message)
      );
    }
  );

  store.listen(
    jobActions.NOTIFY_BUILD_STEP_STARTED,
    {},
    ({ buildId, stepName }) => {
      wrapper(buildId, () => storage.buildStepStarted(buildId, stepName));
    }
  );

  store.listen(
    jobActions.NOTIFY_BUILD_STEP_SUCCESS,
    {},
    ({ buildId, stepName }) => {
      wrapper(buildId, () => storage.buildStepSuccess(buildId, stepName));
    }
  );

  store.listen(
    jobActions.NOTIFY_BUILD_STEP_FAILURE,
    {},
    ({ buildId, stepName }) => {
      wrapper(buildId, () => storage.buildStepFailure(buildId, stepName));
    }
  );
};
