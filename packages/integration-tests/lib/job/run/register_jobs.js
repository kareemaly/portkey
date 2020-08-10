const { createStore } = require("@portkey/store");
const { registerHandlers, actions } = require("@portkey/job");

const store = createStore();

registerHandlers(store);

const success = async () =>
  new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("Timeout")), 100);
    const job = {
      jobName: "frontend-builder",
      jobPath: "test.js"
    };
    store.listen(actions.ADD_JOB_SUCCESS, { job }, resolve);
    store.dispatch(actions.addJob({ job }));
  });

Promise.all([success()]).catch(err => {
  console.error(err);
  process.exit(1);
});
