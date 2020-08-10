const { createActions } = require("@portkey/actions");

module.exports = createActions("JOB_OUTPUT_STREAM", [
  {
    name: "SEND",
    payload: {
      type: "object",
      required: ["buildId", "stepName", "message", "jobName"],
      properties: {
        jobName: { type: "string" },
        buildId: { type: "string" },
        stepName: { type: "string" },
        message: { type: "string" }
      }
    }
  }
]);
