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

const test1 = async () => {
  await store.waitFor(
    jobActions.RUN_JOB_STARTED,
    { jobName: "first" },
    {
      timeout: 10
    }
  );
  store.dispatch(
    jobActions.runJobStarted({
      jobName: "second"
    })
  );
};

const test2 = async () => {
  store.dispatch(
    jobActions.runJobStarted({
      jobName: "first"
    })
  );
  await store.waitFor(
    jobActions.RUN_JOB_STARTED,
    { jobName: "second" },
    {
      timeout: 10
    }
  );
  try {
    await store.waitFor(
      jobActions.RUN_JOB_STARTED,
      { jobName: "second" },
      {
        timeout: 10
      }
    );
  } catch (err) {
    if (!err.message.startsWith("Timeout")) {
      throw new Error("Timeout not triggering the reject");
    }
  }
};

Promise.all([test1(), test2()]).catch(err => {
  console.error(err);
  process.exit(1);
});
