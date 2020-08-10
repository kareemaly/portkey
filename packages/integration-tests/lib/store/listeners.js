const { delayPromise, createTimeoutPromise } = require("@portkey/utils");
const { createStore } = require("@portkey/store");
const { createActions } = require("@portkey/actions");

const store = createStore();
const jobActions = createActions([
  {
    name: "RUN_JOB",
    payload: {
      type: "object",
      required: ["jobName"],
      properties: {
        jobName: { type: "string" }
      }
    }
  }
]);

const listener = (jobName, calledTimes) => {
  let i = 0;
  return createTimeoutPromise(
    (resolve, reject) => {
      store.listen(jobActions.RUN_JOB_STARTED, { jobName }, () => {
        i++;
        if (i === calledTimes) {
          resolve();
        }
      });
    },
    100,
    `Timeout reached for ${jobName}`
  );
};

const run = async () => {
  await delayPromise(1);
  for (let i = 0; i < 3; i++) {
    store.dispatch(
      jobActions.runJobStarted({
        jobName: "second"
      })
    );
    store.dispatch(
      jobActions.runJobStarted({
        jobName: "first"
      })
    );
  }
  for (let i = 0; i < 3; i++) {
    store.dispatch(
      jobActions.runJobStarted({
        jobName: "second"
      })
    );
  }
};

Promise.all([listener("second", 6), listener("first", 3), run()]).catch(err => {
  console.error(err);
  process.exit(1);
});
