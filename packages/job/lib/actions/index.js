const { createActions } = require("@portkey/actions");
const jobSchema = require("../utils/jobSchema");

module.exports = createActions([
  {
    name: "ADD_JOB",
    payload: {
      type: "object",
      required: ["job"],
      properties: {
        job: jobSchema
      }
    }
  },
  {
    name: "RUN_JOB",
    payload: {
      type: "object",
      required: ["jobName"],
      properties: {
        jobName: { type: "string" },
        viewerId: { type: "string" }
      }
    }
  },
  {
    name: "NOTIFY_BUILD",
    payload: {
      type: "object",
      required: ["jobName"],
      properties: {
        jobName: { type: "string" },
        buildId: { type: "string" }
      }
    }
  },
  {
    name: "NOTIFY_BUILD_STEP",
    payload: {
      type: "object",
      required: ["jobName", "stepName"],
      properties: {
        jobName: { type: "string" },
        buildId: { type: "string" },
        stepTitle: { type: "string" }
      }
    }
  }
]);
