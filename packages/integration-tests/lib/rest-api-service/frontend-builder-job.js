const { actions: outputStreamActions } = require("@portkey/job-output-stream");

module.exports = (store, { buildId }) => {
  return {
    steps: [
      {
        name: "Build",
        run: async () => {
          store.dispatch(
            outputStreamActions.send({
              buildId,
              stepName: "Build",
              message: "Logging some events"
            })
          );
          await new Promise(resolve => setTimeout(resolve, 6000));
          store.dispatch(
            outputStreamActions.send({
              buildId,
              stepName: "Build",
              message: "Successful Build"
            })
          );
        }
      },
      {
        name: "Deploy",
        run: () => {
          throw new Error("something");
        }
      }
    ]
  };
};
