const path = require("path");
const { createStore } = require("@portkey/store");
const { registerHandlers, actions } = require("@portkey/job");

const store = createStore();

registerHandlers(store);

const success = async () =>
  new Promise(async (resolve, reject) => {
    setTimeout(() => reject(new Error("Timeout")), 500);
    const job = {
      jobName: "frontend-builder",
      jobPath: path.resolve(__dirname, "job1.js")
    };
    store.dispatch(actions.addJob({ job }));
    await store.waitFor(actions.ADD_JOB_SUCCESS);
    store.dispatch(
      actions.runJob({ jobName: "frontend-builder", viewerId: "123" })
    );
    resolve();
  });

Promise.all([success()]).catch(err => {
  console.error(err);
  process.exit(1);
});
