const path = require("path");
const { fork } = require("child_process");
const ipc = require("../../lib")();

const run = async () =>
  new Promise((resolve, reject) => {
    const process1 = fork(path.resolve(__dirname, "process1.js"));
    const process2 = fork(path.resolve(__dirname, "process2.js"));

    ipc.addChildProcess(process1);
    ipc.addChildProcess(process2);

    ipc.listen(data => console.log(`[Parent] ${data}`));

    const unsubscribe = ipc.listen(data => {
      if (data === "process1_ready") {
        ipc.send("execute_process1");
        unsubscribe();
      }
    });

    setTimeout(() => reject(new Error("Process2 never was executed!")), 500);

    ipc.listen(data => {
      if (data === "process2_executed") {
        resolve();
      }
    });
  });

run().catch(err => {
  console.error(err);
  process.exit(1);
});
