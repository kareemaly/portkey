const path = require("path");
const { fork } = require("child_process");
const { createStore } = require("@portkey/store");
const actions = require("./actions");

const store = createStore();

const run = async () => {
  const process1 = fork(path.resolve(__dirname, "process1.js"));
  const process2 = fork(path.resolve(__dirname, "process2.js"));

  store.addChildProcess(process1);
  store.addChildProcess(process2);

  console.log("here");
  await store.waitFor(actions.SEND_TO_PROCESS_STARTED, { name: "first" }, 500);
  store.dispatch(
    actions.sendToProcess({
      name: "first"
    })
  );
  await store.waitFor(actions.SEND_TO_PROCESS_SUCCESS, { name: "first" }, 100);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
