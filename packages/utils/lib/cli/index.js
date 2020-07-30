const { spawn } = require("child_process");

const spawnCommand = pkCore => (command, commandParams = [], cliOptions) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, commandParams, cliOptions);

    child.stdout.on("data", chunk => {
      pkCore.io.showMessage({
        type: "info",
        message: chunk.toString()
      });
    });

    child.stderr.on("data", err => {
      pkCore.io.showMessage({
        type: "warning",
        message: err.toString()
      });
    });

    child.on("close", code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} failed`));
      }
    });
  });

module.exports = pkCore => ({
  execCommand: spawnCommand(pkCore)
});
