const { spawn } = require("child_process");
const stdStreamHandler = require("./stdStreamHandler");

module.exports = store => async ({ job, buildId }) => {
  const childProcess = spawn(job.jobPath, [
    JSON.stringify({
      normalizedStore: store.normalize(),
      jobName: job.jobName,
      buildId
    })
  ]);

  await stdStreamHandler(store, childProcess, { buildId });
};
