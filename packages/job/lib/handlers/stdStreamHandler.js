const { actions: outputStreamActions } = require("@portkey/job-output-stream");

function stdStreamHandler(store, ps, { buildId }) {
  return new Promise((resolve, reject) => {
    ps.stdout.on("data", data => {
      store.dispatch(
        outputStreamActions.send({
          buildId,
          message: data.toString()
        })
      );
    });

    ps.stderr.on("data", data => {
      store.dispatch(
        outputStreamActions.send({
          buildId,
          message: data.toString()
        })
      );
    });

    ps.on("close", code => {
      if (code !== 0) {
        reject(new Error(`Process failed with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

module.exports = stdStreamHandler;
