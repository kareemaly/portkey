const { createActions } = require("@portkey/actions");

module.exports = createActions([
  {
    name: "STORE_BUILD",
    payload: {
      type: "object",
      required: ["buildId", "status"],
      properties: {
        buildId: { type: "string" },
        status: { type: "string" }
      }
    }
  }
]);
