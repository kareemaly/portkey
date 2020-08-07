const path = require("path");
const { createStore } = require("@portkey/store");
const {
  memoryStorage: jobStorage,
  registerHandlers: jobRegisterHandlers,
  actions: jobActions
} = require("@portkey/job");
const { serve: serveApi } = require("@portkey/rest-api-service");
const {
  memoryStorage: buildHistoryStorage,
  registerHandlers: buildHistoryRegisterHandlers
} = require("@portkey/build-history-storage");

const store = createStore();

const app = express();
const http = httpModule.createServer(app);

serveApi({
  store,
  expressApp: app,
  httpServer: http,
  buildHistoryStorage,
  jobStorage,
  apiBaseUrl: "/api"
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

http.listen(4000, () => {
  console.log(`App listenting on port 4000`);
});
