const _ = require("lodash");

const listeners = [];
const childProcesses = [];

const matchListener = (listener, eventName, payload) => {
  return (
    listener.name === eventName && _.isMatch(payload, listener.matchPayload)
  );
};

const emit = event => {
  listeners.forEach(listener => {
    if (matchListener(listener, event.name, event.payload)) {
      listener.callback(event.payload);
    }
  });
  childProcesses.forEach(child => {
    child.send({
      isPKEvent: true,
      name: event.name,
      payload: event.payload
    });
  });
};

const listen = (eventName, matchPayload = {}, callback) => {
  listeners.push({
    name: eventName,
    matchPayload,
    callback
  });
};

const addChildProcess = childProcess => {
  childProcesses.push(childProcess);
};

// If this is a child process and received a message from parent then emit that
// event
process.on("message", data => {
  if (data.isPKEvent) {
    emit(data.name, data.payload);
  }
});

module.exports = () => {
  return {
    listen,
    emit,
    addChildProcess
  };
};
