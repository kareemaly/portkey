const { actions: outputStreamActions } = require("@portkey/job-output-stream");

module.exports = (store, { jobName, buildId, stepName }) => {
  function execCommand(cmd) {
    store.dispatch(
      outputStreamActions.send({
        buildId,
        stepName,
        message: cmd
      })
    );
  }
};
