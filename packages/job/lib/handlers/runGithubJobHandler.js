const path = require("path");
const { spawn } = require("child_process");
const { v4: uuid } = require("uuid");
const stdStreamHandler = require("./stdStreamHandler");
const { getJobFromGithub, cleanGithubJob } = require("../getters/github");
const actions = require("../actions");

module.exports = store => async ({ job, buildId }) => {
  const stepData = {
    stepId: uuid(),
    stepName: "Prepare",
    jobName: job.jobName,
    buildId
  };

  let repoFullPath;

  try {
    store.dispatch(actions.notifyBuildStepStarted(stepData));
    const result = await getJobFromGithub({
      store,
      githubUrl: job.githubUrl,
      buildId
    });
    repoFullPath = result.repoFullPath;
    store.dispatch(actions.notifyBuildStepSuccess(stepData));
  } catch (err) {
    store.dispatch(
      actions.notifyBuildStepFailure({
        ...stepData,
        error: {
          message: err.message,
          stack: err.stack
        }
      })
    );
  }

  const childProcess = spawn(path.join(repoFullPath, job.jobPath), [
    JSON.stringify({
      normalizedStore: store.normalize(),
      jobName: job.jobName,
      buildId
    })
  ]);

  await stdStreamHandler(store, childProcess, { buildId });
  await cleanGithubJob({ buildId });
};
