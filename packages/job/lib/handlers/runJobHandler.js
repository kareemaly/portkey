const { process } = require("@portkey/utils");
const { v4: uuid } = require("uuid");
const jobStorage = require("../storage/memoryStorage");
const actions = require("../actions");

module.exports = store => async ({ viewerId, jobName }) => {
  const { jobPath } = await jobStorage.get(jobName);
  const buildId = uuid();

  const pid = await process.start(
    path.resolve(__dirname, "../runner/jobProcessRunner.js"),
    {
      viewerId,
      normalizedStore: store.normalize(),
      jobName,
      jobPath,
      buildId
    }
  );
  store.addChildProcess(pid);
  await store.waitForAny([
    { action: actions.NOTIFY_BUILD_SUCCESS, matchPayload: { buildId } },
    { action: actions.NOTIFY_BUILD_FAILURE, matchPayload: { buildId } }
  ]);
  store.removeChildProcess(pid);
};
