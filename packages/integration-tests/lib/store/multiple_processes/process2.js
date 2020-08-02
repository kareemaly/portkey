const { createStore } = require("@portkey/store");

const store = createStore();

const run = async () => {
  await store.waitFor(actions.SEND_TO_PROCESS, { name: "second" }, 10);
  store.dispatch(
    actions.sendToProcessSuccess({
      name: "second"
    })
  );
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
