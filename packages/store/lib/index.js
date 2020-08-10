const createLocalStore = require("./localStore/createLocalStore");
const reCreateLocalStore = require("./localStore/reCreateLocalStore");

module.exports = {
  createStore: createLocalStore,
  reCreateStore: reCreateLocalStore,
};
