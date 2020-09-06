const actions = require("../actions");
const runJobHandler = require("./runJobHandler");

module.exports = (store, storage) => {
  store.listen(actions.RUN_JOB, {}, runJobHandler(store));
  store.listen(actions.ADD_JOB, {}, async ({ job }) => {
    try {
      store.dispatch(actions.addJobStarted({ job }));
      await storage.add(job.jobName, job);
      store.dispatch(actions.addJobSuccess({ job }));
    } catch (error) {
      store.dispatch(
        actions.addJobFailure({ error: { message: error.message } })
      );
    }
  });
};
