const path = require("path");
const { actions: outputStreamActions } = require("@portkey/job-output-stream");
const debug = require("debug")("@portkey/job:runJobHandler");
const { spawn } = require("child_process");
const { v4: uuid } = require("uuid");
const jobStorage = require("../storage/memoryStorage");
const actions = require("../actions");

function stdStreamHandler(store, ps, { buildId }) {
  return new Promise((resolve, reject) => {
    ps.stdout.on("data", data => {
      store.dispatch(
        outputStreamActions.send({
          buildId,
          message: data.toString()
        })
      );
    });

    ps.stderr.on("data", data => {
      store.dispatch(
        outputStreamActions.send({
          buildId,
          message: data.toString()
        })
      );
    });

    ps.on("close", code => {
      if (code !== 0) {
        reject(new Error(`Process failed with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

module.exports = store => async ({ viewerId, jobName }) => {
  debug("Running job %s by viewer %s", jobName, viewerId);
  const buildId = uuid();
  store.dispatch(actions.notifyBuildStarted({ jobName, buildId }));
  const { jobPath } = await jobStorage.get(jobName);
  const childProcess = spawn(jobPath, [
    JSON.stringify({
      normalizedStore: store.normalize(),
      jobName,
      buildId
    })
  ]);
  try {
    await stdStreamHandler(store, childProcess, { buildId });
    store.dispatch(actions.notifyBuildSuccess({ jobName, buildId }));
  } catch (error) {
    store.dispatch(
      actions.notifyBuildFailure({
        jobName,
        buildId,
        error: {
          message: error.message
        }
      })
    );
  }
};
