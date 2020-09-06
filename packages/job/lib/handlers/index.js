const debug = require("debug")("@portkey/job:handlers");
const { v4: uuid } = require("uuid");
const runJobHandler = require("./runJobHandler");
const runGithubJobHandler = require("./runGithubJobHandler");
const actions = require("../actions");

const getJobHandler = job => {
  if (job.github) {
    return runGithubJobHandler;
  }
  return runJobHandler;
};

module.exports = (store, storage) => {
  store.listen(actions.RUN_JOB, {}, async ({ viewerId, jobName }) => {
    debug("Running job %s by viewer %s", jobName, viewerId);
    const buildId = uuid();
    store.dispatch(actions.notifyBuildStarted({ jobName, buildId }));

    try {
      const job = await storage.get(jobName);
      await getJobHandler(job)(store)({ job, buildId });
      store.dispatch(actions.notifyBuildSuccess({ jobName, buildId }));
    } catch (error) {
      store.dispatch(
        actions.notifyBuildFailure({
          jobName,
          buildId,
          error: {
            message: error.message,
            stack: error.stack
          }
        })
      );
    }
  });
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
