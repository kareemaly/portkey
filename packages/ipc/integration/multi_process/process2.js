const ipc = require("../../lib")();

const run = async () => {
  ipc.listen(data => console.log(`[Process2] ${data}`));

  ipc.listen(data => {
    if (data === "execute_process2") {
      ipc.send("process2_executed");
    }
  });
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
