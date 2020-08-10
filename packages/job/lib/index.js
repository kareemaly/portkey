const registerHandlers = require("./handlers");
const actions = require("./actions");
const memoryStorage = require("./storage/memoryStorage");

module.exports = {
  memoryStorage,
  registerHandlers,
  actions
};
