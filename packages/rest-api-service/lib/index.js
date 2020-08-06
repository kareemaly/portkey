const express = require("express");
const cors = require("cors");
const httpModule = require("http");
const bodyParser = require("body-parser");
const router = require("./router");
const socketIo = require("socket.io");
const config = require("./config");
const outputStreamSocketIO = require("./outputStreamSocketIO");

const startServer = (store, { buildHistoryStorage, jobStorage }) => {
  const app = express();
  const http = httpModule.createServer(app);
  const io = socketIo(http);
  app.use(cors());
  app.use(bodyParser.json());
  app.use("/api", router(store, { buildHistoryStorage, jobStorage }));
  outputStreamSocketIO(store, io);
  http.listen(config.port, () => {
    console.log(`App listenting on port ${config.port}`);
  });
};

module.exports = startServer;
