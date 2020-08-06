const {
  actions: jobOutputStreamActions
} = require("@portkey/job-output-stream");
const { actions: jobActions } = require("@portkey/job");

const emitEvents = (store, io, events) => {
  events.forEach(event => {
    store.listen(event, {}, payload => io.emit(event, payload));
  });
};

module.exports = (store, io) => {
  emitEvents(store, io, [
    jobOutputStreamActions.SEND,
    jobActions.NOTIFY_BUILD_STARTED,
    jobActions.NOTIFY_BUILD_SUCCESS,
    jobActions.NOTIFY_BUILD_FAILURE,
    jobActions.NOTIFY_BUILD_STEP_STARTED,
    jobActions.NOTIFY_BUILD_STEP_SUCCESS,
    jobActions.NOTIFY_BUILD_STEP_FAILURE
  ]);
};
