const path = require("path");
const { createStore } = require("@portkey/store");
const {
  memoryStorage: jobStorage,
  registerHandlers: jobRegisterHandlers,
  actions: jobActions
} = require("@portkey/job");
const restApiService = require("@portkey/rest-api-service");
const {
  memoryStorage: buildHistoryStorage,
  registerHandlers: buildHistoryRegisterHandlers
} = require("@portkey/build-history-storage");

const store = createStore();

restApiService(store, {
  buildHistoryStorage,
  jobStorage
});

buildHistoryRegisterHandlers(store, buildHistoryStorage);
jobRegisterHandlers(store, jobStorage);

store.dispatch(
  jobActions.addJob({
    job: {
      jobName: "frontend-builder",
      jobPath: path.resolve(__dirname, "frontend-builder-job.js")
    }
  })
);
