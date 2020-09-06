const createSocketIOStore = require("./createSocketIOStore");

module.exports = function recreateSocketIOStore(normalizedStore) {
  return createSocketIOStore(normalizedStore);
};
