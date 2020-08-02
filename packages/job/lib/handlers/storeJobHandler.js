const actions = require("../actions");
const validateJobOrFail = require("../utils/validateJobOrFail");
const jobStorage = require("../storage/memoryStorage");

module.exports = store => async ({ job }) => {
  try {
    store.dispatch(actions.addJobStarted({ job }));
    await jobStorage.add(job);
    store.dispatch(actions.addJobSuccess({ job }));
  } catch (error) {
    store.dispatch(actions.addJobFailure({ error }));
  }
};
