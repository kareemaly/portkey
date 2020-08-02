const debug = require("debug")("@portkey/job:jobProcessRunner");
const { reCreateStore } = require("@portkey/store");
const actions = require("../actions");

const run = async () => {
  const { normalizedStore, jobName, jobPath, buildId } = JSON.parse(
    process.argv[process.argv.length - 1]
  );
  debug("Running job %O", {
    normalizedStore,
    jobName,
    jobPath,
    buildId
  });
  const store = await reCreateStore(normalizedStore);
  try {
    const executor = require(jobPath)(store, { buildId });
    store.dispatch(
      actions.notifyBuildStarted({
        jobName,
        buildId
      })
    );
    await executor.prepare();
    await executor.steps.reduce(async (acc, step) => {
      return acc.then(async result => {
        store.dispatch(
          actions.notifyBuildStepStarted({
            stepName: step.name,
            jobName,
            buildId
          })
        );
        try {
          await step.run(result);
          store.dispatch(
            actions.notifyBuildStepSuccess({
              stepName: step.name,
              jobName,
              buildId
            })
          );
        } catch (error) {
          store.dispatch(
            actions.notifyBuildStepFailure({
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
        jobName,
        buildId
      })
    );
  } catch (error) {
    store.dispatch(
      actions.notifyBuildFailure({
        jobName,
        buildId,
        error
      })
    );
  }
};

run();
