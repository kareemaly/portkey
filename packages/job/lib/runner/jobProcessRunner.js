const { reCreateStore } = require("@portkey/store");
const { process } = require("@portkey/utils");
const actions = require("../actions");

const run = async () => {
  const {
    viewerId,
    normalizedStore,
    jobName,
    jobPath,
    buildId
  } = await process.getArguments();
  const store = await reCreateStore(normalizedStore);
  const executor = require(jobPath)(store, { viewerId, buildId });
  store.dispatch(
    action.notifyBuildStart({
      viewerId,
      jobName,
      buildId
    })
  );
  try {
    await executor.prepare();
    await executor.steps.reduce(async (acc, step) => {
      return acc.then(async result => {
        store.dispatch(
          action.notifyBuildStepStart({
            viewerId,
            stepName: step.name,
            jobName,
            buildId
          })
        );
        try {
          await step.run(result);
          store.dispatch(
            action.notifyBuildStepSuccess({
              viewerId,
              stepName: step.name,
              jobName,
              buildId
            })
          );
        } catch (error) {
          store.dispatch(
            action.notifyBuildStepFailure({
              viewerId,
              stepName: step.name,
              jobName,
              buildId,
              error
            })
          );
        }
      });
    }, Promise.resolve());
    store.dispatch(
      actions.notifyBuildSuccess({
        viewerId,
        jobName,
        buildId
      })
    );
  } catch (error) {
    store.dispatch(
      actions.notifyBuildFailure({
        viewerId,
        jobName,
        buildId,
        error
      })
    );
  }
};

run();
