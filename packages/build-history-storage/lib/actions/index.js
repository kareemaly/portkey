const { createActions } = require("@portkey/actions");

module.exports = createActions("BUILD_HISTORY_STORAGE", [
  {
    name: "STORE_STARTED",
    payload: {
      type: "object",
      required: ["buildId"],
      properties: {
        buildId: { type: "string" }
      }
    }
  },
  {
    name: "STORE_SUCCESS",
    payload: {
      type: "object",
      required: ["buildId"],
      properties: {
        buildId: { type: "string" }
      }
    }
  },
  {
    name: "STORE_FAILURE",
    payload: {
      type: "object",
      required: ["buildId", "error"],
      properties: {
        buildId: { type: "string" },
        error: { type: "object" }
      }
    }
  }
]);
