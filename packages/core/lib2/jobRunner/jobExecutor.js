const actions = require("./actions");

module.exports = async (store, { jobFilename, jobId }) => {
  const executor = require(jobFilename);
  const { prepare, steps } = executor(jobId);
  await prepare();
  return steps.reduce(async (acc, step) => {
    return acc.then(result => {
      store.dispatch(actions.notifyBuildStepStart(step));
      return step.run(result);
    });
  }, Promise.resolve());
};
