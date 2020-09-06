const { createActions } = require("@portkey/actions");

module.exports = createActions("JOB_OUTPUT_STREAM", [
  {
    name: "SEND",
    payload: {
      type: "object",
      required: ["buildId"],
      properties: {
        buildId: { type: "string" },
        message: { type: "string" }
      }
    }
  }
]);
