const path = require("path");
const debug = require("debug")("@portkey/job:runJobHandler");
const { fork } = require("child_process");
const { v4: uuid } = require("uuid");
const any = require("promise.any");
const jobStorage = require("../storage/memoryStorage");
const actions = require("../actions");

module.exports = store => async ({ viewerId, jobName }) => {
  debug("Running job %s by viewer %s", jobName, viewerId);
  try {
    const { jobPath } = await jobStorage.get(jobName);
    const buildId = uuid();

    const childProcess = fork(
      path.resolve(__dirname, "../runner/jobProcessRunner.js"),
      [
        JSON.stringify({
          normalizedStore: store.normalize(),
          jobName,
          jobPath,
          buildId
        })
      ]
    );
    store.addChildProcess(childProcess);
    await any([
      store.waitFor(actions.NOTIFY_BUILD_SUCCESS, { buildId }),
      store.waitFor(actions.NOTIFY_BUILD_FAILURE, { buildId })
    ]);
    store.removeChildProcessById(childProcess.pid);
  } catch (error) {
    store.dispatch(actions.notifyBuildFailure({ jobName, buildId, error }));
  }
};
