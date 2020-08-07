const express = require("express");
const cors = require("cors");
const httpModule = require("http");
const bodyParser = require("body-parser");
const router = require("./router");
const socketIo = require("socket.io");
const config = require("./config");
const outputStreamSocketIO = require("./outputStreamSocketIO");

const startServer = ({
  store,
  expressApp,
  httpServer,
  buildHistoryStorage,
  jobStorage,
  apiBaseUrl = "/api"
}) => {
  const io = socketIo(httpServer);
  app.use(bodyParser.json());
  app.use(apiBaseUrl, router(store, { buildHistoryStorage, jobStorage }));
  outputStreamSocketIO(store, io);
};

module.exports = {
  serve
};
