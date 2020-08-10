const { createStore } = require("@portkey/store");
const actions = require("./actions");

const store = createStore();

const run = async () => {
  store.dispatch(
    actions.sendToProcessStarted({
      name: "first"
    })
  );
  await store.waitFor(actions.SEND_TO_PROCESS, { name: "first" }, 500);
  store.dispatch(
    actions.sendToProcessSuccess({
      name: "first"
    })
  );
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
