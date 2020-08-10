const ipcCreator = require("@portkey/ipc");
const debug = require("debug")("@portkey/store");
const _ = require("lodash");

module.exports = () => {
  const ipc = ipcCreator();

  const dispatch = ({ action, payload }) => {
    debug("Dispatching %s %O", action, payload);
    ipc.send({ action, payload });
  };

  const listen = (matchAction, matchPayload, callback) => {
    return ipc.listen(({ action, payload }) => {
      if (matchAction === action && _.isMatch(payload, matchPayload)) {
        callback(payload);
      }
    });
  };

  const waitFor = (matchAction, matchPayload, timeout) =>
    new Promise((resolve, reject) => {
      if (_.isNumber(timeout)) {
        setTimeout(() => {
          debug("Timeout while waiting for %s %O", matchAction, matchPayload);
          reject(new Error("Timeout Error"));
        }, timeout);
      }
      debug("Listener registered: %s %O", matchAction, matchPayload);
      listen(matchAction, matchPayload, resolve);
    });

  const normalize = () => ({});

  return {
    normalize,
    dispatch,
    waitFor,
    listen,
    addChildProcess: ipc.addChildProcess,
    removeChildProcessById: ipc.removeChildProcessById
  };
};
