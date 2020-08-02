const any = require("promise.any");
const _ = require("lodash");

const listeners = [];
const childProcesses = [];

const matchListener = (listener, action, payload) => {
  return (
    listener.action === action && _.isMatch(payload, listener.matchPayload)
  );
};

const removeListener = index => {
  listeners.splice(index, 1);
};

const dispatch = () => ({ action, payload }) => {
  listeners.forEach(listener => {
    if (matchListener(listener, action, payload)) {
      listener.callback(payload);
    }
  });
  childProcesses.forEach(child => {
    child.send({
      isPKEvent: true,
      action,
      payload
    });
  });
};

const waitFor = () => (action, matchPayload = {}, timeout) =>
  new Promise((resolve, reject) => {
    const index = listeners.push({
      action,
      matchPayload,
      callback: payload => {
        resolve(payload);
        removeListener(index - 1);
      }
    });
    if (_.isNumber(timeout)) {
      setTimeout(() => {
        reject(
          new Error(
            `Timeout ${timeout} reached while waiting for ${action} with parameters ${JSON.stringify(
              matchPayload
            )}`
          )
        );
        removeListener(index - 1);
      }, timeout);
    }
  });

const listen = () => (action, matchPayload, callback) => {
  listeners.push({
    action,
    matchPayload,
    callback
  });
};

const waitForAny = () => () =>
  any(
    listeners.map(listener =>
      waitFor(listener.action, listener.matchPayload, listener.timeout)
    )
  );

const addChildProcess = () => pid => childProcesses.push(pid);

const localStore = () => {
  const _dispatch = dispatch();
  // Receive messages from parent process
  process.on("message", event => {
    if (event.isPKEvent) {
      _dispatch(event);
    }
  });
  return {
    dispatch: _dispatch,
    waitFor: waitFor(),
    waitForAny: waitForAny(),
    listen: listen()
  };
};

module.exports = localStore;
