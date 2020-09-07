const registerHandlers = require("./handlers");
const memoryStorage = require("./storage/memoryStorage");
const mongoStorage = require("./storage/mongoStorage");

module.exports = {
  memoryStorage,
  mongoStorage,
  registerHandlers
};
