const _ = require("lodash");

module.exports = () => {
  const childProcesses = [];
  const listeners = [];

  const send = (data, { ignoreParent, ignoreChildPID } = {}) => {
    listeners.forEach(listener => listener(data));

    // Send to parent
    if (process.send && !ignoreParent) {
      process.send({
        isPKMessage: true,
        data
      });
    }

    // Send to all children except ignored one
    childProcesses.forEach(childProcess => {
      if (childProcess.pid !== ignoreChildPID) {
        childProcess.send({
          isPKMessage: true,
          data
        });
      }
    });
  };

  const listen = listener => {
    const len = listeners.push(listener);
    return () => {
      listeners.splice(len - 1, 1);
    };
  };

  const addChildProcess = childProcess => {
    childProcesses.push(childProcess);
    // When receiving messages from children
    childProcess.on("message", message => {
      if (message.isPKMessage) {
        send(message.data, { ignoreChildPID: childProcess.pid });
      }
    });
  };

  const removeChildProcessById = pid => {
    const index = childProcesses.findIndex(p => p.pid === pid);
    childProcesses.splice(index, 1);
  };

  // Received from parent
  process.on("message", message => {
    if (message.isPKMessage) {
      send(message.data, { ignoreParent: true });
    }
  });

  return {
    send,
    listen,
    addChildProcess,
    removeChildProcessById
  };
};
