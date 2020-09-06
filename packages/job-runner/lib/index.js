const { reCreateStore } = require("@portkey/store");
const { actions } = require("@portkey/job");
const { v4: uuid } = require("uuid");

module.exports = async function jobRunner({ steps }) {
  const { normalizedStore, jobName, buildId } = JSON.parse(
    process.argv[process.argv.length - 1]
  );
  const store = await reCreateStore(normalizedStore);
  await steps.reduce(async (acc, step) => {
    return acc.then(async result => {
      const data = {
        stepId: uuid(),
        stepName: step.name,
        jobName,
        buildId
      };
      store.dispatch(actions.notifyBuildStepStarted(data));
      try {
        await step.run({ store });
        store.dispatch(actions.notifyBuildStepSuccess(data));
      } catch (error) {
        store.dispatch(
          actions.notifyBuildStepFailure({
            ...data,
            error: {
              message: error.message
            }
          })
        );
      }
    });
  }, Promise.resolve());
  store.disconnect();
};
