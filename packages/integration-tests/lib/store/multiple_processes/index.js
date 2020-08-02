const path = require("path");
const { fork } = require("child_process");
const { createStore } = require("@portkey/store");

const store = createStore();

const run = async () => {
  const process1 = fork(path.resolve(__dirname, "process1.js"));
  const process2 = fork(path.resolve(__dirname, "process1.js"));

  store.addChildProcess(process1);
  store.addChildProcess(process2);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
