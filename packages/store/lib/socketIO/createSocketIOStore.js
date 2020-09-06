const debug = require("debug")("@portkey/store");
const _ = require("lodash");
const createClientSocketIOStore = require("./createClientSocketIOStore");
const createServerSocketIOStore = require("./createServerSocketIOStore");

async function createSocketIOStore({
  serverSocket,
  isClient = false,
  serverUrl,
  clientConnectOptions = {}
}) {
  const listeners = [];

  const store = isClient
    ? await createClientSocketIOStore({
        serverUrl,
        clientConnectOptions
      })
    : await createServerSocketIOStore({ serverSocket });

  function dispatch({ action, payload }) {
    debug("Dispatching %s %O", action, payload);
    store.dispatch({ action, payload });
    listeners
      .filter(l => l.action === action && _.isMatch(payload, l.matchPayload))
      .forEach(({ callback }) => callback(payload));
    listeners
      .filter(l => l.once)
      .forEach(({ callback }) => removeListener(callback));
  }

  function removeListener(matchCallback) {
    listeners = listeners.filter(({ callback }) => callback !== matchCallback);
  }

  function listen(action, matchPayload, callback) {
    store.listen(action, matchPayload, callback);
    listeners.push({
      action,
      matchPayload,
      callback
    });
  }

  function listenOnce(action, matchPayload, callback) {
    store.listenOnce(action, matchPayload, callback);
    listeners.push({
      action,
      matchPayload,
      callback,
      once: true
    });
  }

  function waitFor(matchAction, matchPayload, timeout) {
    return new Promise((resolve, reject) => {
      if (_.isNumber(timeout)) {
        setTimeout(() => {
          debug("Timeout while waiting for %s %O", matchAction, matchPayload);
          reject(new Error("Timeout Error"));
        }, timeout);
      }
      listenOnce(matchAction, matchPayload, resolve);
    });
  }

  function normalize() {
    return { isClient: true, clientConnectOptions, serverUrl };
  }

  return {
    normalize,
    dispatch,
    waitFor,
    listen,
    listenOnce,
    disconnect: store.disconnect,
    removeListener
  };
}

module.exports = createSocketIOStore;
