const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
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
  mongoStorage: buildHistoryStorageCreator,
  registerHandlers: buildHistoryRegisterHandlers
} = require("@portkey/build-history-storage");
const {
  middleware: gitHooksMiddleware
} = require("@portkey/git-flow-middleware");

const connectMongoDB = () =>
  new Promise((resolve, reject) => {
    const mongoInstance = new mongoose.Mongoose();
    mongoInstance.connect("mongodb://localhost", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      dbName: "portkey2"
    });

    mongoInstance.connection.on("error", error => {
      reject("connection error");
    });

    mongoInstance.connection.once("open", function() {
      console.log("Connected to database");
      resolve(mongoInstance);
    });
  });

async function serve() {
  const mongoInstance = await connectMongoDB();

  const app = express();
  const http = httpModule.createServer(app);
  const io = socketIo(http);

  const buildHistoryStorage = buildHistoryStorageCreator({
    mongoInstance
  });

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

  jobStorage.add("frontend-builder-local", {
    jobPath: path.resolve(__dirname, "frontend-builder-job.js")
  });

  jobStorage.add("frontend-builder-github", {
    jobPath:
      "packages/integration-tests/lib/rest-api-service/frontend-builder-job.js",
    github: {
      url: "git@github.com:kareemaly/portkey"
    }
  });

  buildHistoryRegisterHandlers(store, buildHistoryStorage);
  jobRegisterHandlers(store, jobStorage);

  http.listen(4000, () => {
    console.log(`App listenting on port 4000`);
  });
}

serve().catch(err => {
  process.exit(1);
  console.error(err);
});
