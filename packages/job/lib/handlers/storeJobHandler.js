const validateJobOrFail = require("../utils/validateJobOrFail");
const jobStorage = require("../storage/memoryStorage");

module.exports = store => async job => {
  try {
    await validateJobOrFail(job);
    await jobStorage.add(add);
    store.dispatch(
      actions.addJobSuccess({
        job
      })
    );
  } catch (err) {
    store.dispatch(
      actions.addJobFailure({
        err
      })
    );
  }
};
