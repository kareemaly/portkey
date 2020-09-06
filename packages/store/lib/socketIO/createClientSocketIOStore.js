const ioClient = require("socket.io-client");
const _ = require("lodash");

async function waitForClientConnect(clientSocket) {
  return new Promise((resolve, reject) => {
    clientSocket.on("connect", resolve);
    clientSocket.on("connect_error", reject);
    clientSocket.on("connect_timeout", reject);
  });
}

async function createClientSocketIOStore({
  serverUrl,
  clientConnectOptions = {}
}) {
  const instance = ioClient(serverUrl, clientConnectOptions);
  await waitForClientConnect(instance);

  function listen(action, matchPayload, callback) {
    instance.listen(action, payload => {
      if (_.isMatch(payload, matchPayload)) {
        callback(payload);
      }
    });
  }

  function listenOnce(action, matchPayload, callback) {
    instance.once(action, payload => {
      if (_.isMatch(payload, matchPayload)) {
        callback(payload);
      }
    });
  }

  function dispatch({ action, payload }) {
    instance.emit(action, payload);
  }

  return {
    dispatch,
    listen,
    listenOnce
  };
}

module.exports = createClientSocketIOStore;
