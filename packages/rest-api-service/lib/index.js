const bodyParser = require("body-parser");
const outputStreamSocketIO = require("./outputStreamSocketIO");
const router = require("./router");

const serve = ({
  store,
  expressApp,
  buildHistoryStorage,
  jobStorage,
  apiBaseUrl = "/api",
  socketIOInstance: io
}) => {
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
