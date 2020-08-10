const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const outputStreamSocketIO = require("./outputStreamSocketIO");
const router = require("./router");

const serve = ({
  store,
  expressApp,
  httpServer,
  buildHistoryStorage,
  jobStorage,
  apiBaseUrl = "/api"
}) => {
  const io = socketIo(httpServer);
  expressApp.use(bodyParser.json());
  expressApp.use(
    apiBaseUrl,
    router(store, { buildHistoryStorage, jobStorage })
  );
  outputStreamSocketIO(store, io);
};

module.exports = {
  serve
};
