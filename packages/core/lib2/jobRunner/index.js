const actions = require("./actions");

module.exports = (store, { jobName }) => {
  store.listenFor("RUN_JOB", { jobName }, async ({ jobPath }) => {
    const jobFilename = await getJobFilename();
    const jobId = uuid();
    const process = executeJobInProcess(store, {
      jobFilename,
      jobId
    });
    try {
      store.dispatch(actions.notifyBuildStart());
      store.addChildProcess(process.id);
      await process.promise;
      store.removeChildProcess(process.id);
      store.dispatch(actions.notifyBuildSuccess());
    } catch (err) {
      store.removeChildProcess(process.id);
      store.dispatch(actions.notifyBuildFailure(err));
    }
  });
};
