const ipc = require("../../lib")();

const run = async () => {
  ipc.listen(data => console.log(`[Process1] ${data}`));
  ipc.listen(data => {
    if (data === "execute_process1") {
      ipc.send("execute_process2");
    }
  });

  ipc.send("process1_ready");
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
