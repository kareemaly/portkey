const createSocketIOStore = require("./socketIO/createSocketIOStore");
const reCreateSocketIOStore = require("./socketIO/recreateSocketIOStore");

module.exports = {
  createStore: createSocketIOStore,
  reCreateStore: reCreateSocketIOStore
};
