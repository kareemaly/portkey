const path = require("path");
const { cli } = require("@portkey/utils");
const { uiActions } = require("@portkey/actions");

// fake
testJob(memoryStore, { jobId: "random" });

module.exports = (store, { jobId, viewer }) => ({
  prepare: () => {
    cli.setPwd(path.resolve(__dirname, "../"));
  },
  steps: [
    {
      name: "Build",
      run: async () => {
        await cli.execCommand("docker build ...");
        store.dispatch(
          uiActions.askConfirm({
            message: "do you wanna continue?"
          })
        );
        const input = await store.listenFor(uiActions.UI_CONFIRM_INPUT, {
          jobId
        });
        if (input === uiActions.UI_CONFIRM_INPUT_YES) {
          // Continue deployment to production
          store.dispatch(
            jobActions.setStatus({
              status: jobActions.STATUS_SUCCESS,
              tags: ["prod"]
            })
          );
        } else {
          store.dispatch(
            jobActions.setStatus({
              status: jobActions.STATUS_SUCCESS,
              tags: ["qa"]
            })
          );
        }
      }
    }
  ]
});
