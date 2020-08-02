const { createActions } = require("@portkey/actions");

module.exports = createActions([
  {
    name: "SEND_TO_PROCESS",
    payload: {
      type: "object",
      properties: {
        name: { type: "string" }
      }
    }
  }
]);
