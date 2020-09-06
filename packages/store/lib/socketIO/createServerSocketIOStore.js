const _ = require("lodash");

async function createServerSocketIOStore({ serverSocket }) {
  const listeners = [];

  serverSocket.on("connection", socket => {
    socket.use((packet, next) => {
      const [action, payload] = packet;
      listeners.forEach(listener => {
        if (
          _.isMatch(payload, listener.matchPayload) &&
          action === listener.matchAction
        ) {
          listener.callback(payload);
        }
      });
      next();
    });
  });

  function listen(action, matchPayload, callback) {
    listeners.push({
      matchAction: action,
      matchPayload,
      callback
    });
  }

  function listenOnce(action, matchPayload, callback) {
    listeners.push({
      matchAction: action,
      matchPayload,
      callback,
      once: true
    });
  }

  function dispatch({ action, payload }) {
    serverSocket.emit(action, payload);
  }

  return {
    dispatch,
    listen,
    listenOnce
  };
}

module.exports = createServerSocketIOStore;
