const { createStore } = require("@portkey/store");
const { registerHandlers, actions } = require("@portkey/job");

const store = createStore();

registerHandlers(store);

const run = async () => {
  store.dispatch(
    actions.addJob({
      job: {
        jobName: "frontend-builder",
        jobPath: "test.js"
      }
    })
  );
  store.dispatch(
    actions.runJob({
      job: {
        jobName: "frontend-builder",
        jobPath: "test.js"
      }
    })
  );
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
