const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const httpModule = require("http");
const socketIo = require("socket.io");
const { createStore } = require("@portkey/store");
const {
  memoryStorage: jobStorage,
  registerHandlers: jobRegisterHandlers,
  actions: jobActions
} = require("@portkey/job");
const { serve: serveWebApp } = require("@portkey/webapp");
const { serve: serveApi } = require("@portkey/rest-api-service");
const {
  memoryStorage: buildHistoryStorage,
  registerHandlers: buildHistoryRegisterHandlers
} = require("@portkey/build-history-storage");
const {
  middleware: gitHooksMiddleware
} = require("@portkey/git-flow-middleware");

async function serve() {
  const app = express();
  const http = httpModule.createServer(app);
  const io = socketIo(http);

  app.use(bodyParser.json());
  app.use(cors());

  const store = await createStore({
    serverSocket: io.of("/internal"),
    serverUrl: "http://localhost:4000/internal",
    clientConnectOptions: {
      transports: ["websocket"]
    }
  });

  app.post(
    "/git-hooks",
    gitHooksMiddleware({
      store,
      hooks: [
        {
          repository: "OriginPush/op-wsl-java-core",
          events: [
            {
              jobName: "frontend-builder-local",
              event: "push",
              conditions: [
                {
                  selector: ".action",
                  type: "equal",
                  value: "closed"
                }
              ]
            }
          ]
        }
      ]
    })
  );

  serveApi({
    store,
    expressApp: app,
    buildHistoryStorage,
    jobStorage,
    socketIOInstance: io,
    apiBaseUrl: "/api"
  });

  // serveWebApp({
  //   expressApp: app,
  //   userConfig: {
  //     apiBaseUrl: "/api",
  //     socketIoBaseUrl: "/"
  //   }
  // });

  buildHistoryRegisterHandlers(store, buildHistoryStorage);
  jobRegisterHandlers(store, jobStorage);

  store.dispatch(
    jobActions.addJob({
      job: {
        jobName: "frontend-builder-local",
        jobPath: path.resolve(__dirname, "frontend-builder-job.js")
      }
    })
  );

  store.dispatch(
    jobActions.addJob({
      job: {
        jobName: "frontend-builder-github",
        jobPath:
          "packages/integration-tests/lib/rest-api-service/frontend-builder-job.js",
        github: {
          url: "git@github.com:kareemaly/portkey"
        }
      }
    })
  );

  http.listen(4000, () => {
    console.log(`App listenting on port 4000`);
  });
}

serve().catch(console.error);
