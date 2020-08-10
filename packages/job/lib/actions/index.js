const { createActions } = require("@portkey/actions");
const jobSchema = require("../utils/jobSchema");

module.exports = createActions("JOB", [
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
    name: "ADD_JOB_STARTED",
    payload: {
      type: "object",
      required: ["job"],
      properties: {
        job: jobSchema
      }
    }
  },
  {
    name: "ADD_JOB_SUCCESS",
    payload: {
      type: "object",
      required: ["job"],
      properties: {
        job: jobSchema
      }
    }
  },
  {
    name: "ADD_JOB_FAILURE",
    payload: {
      type: "object",
      required: ["error"],
      properties: {
        error: { type: "object" }
      }
    }
  },
  {
    name: "RUN_JOB",
    payload: {
      type: "object",
      required: ["jobName", "viewerId"],
      properties: {
        jobName: { type: "string" },
        viewerId: { type: "string" }
      }
    }
  },
  {
    name: "NOTIFY_BUILD_STARTED",
    payload: {
      type: "object",
      required: ["jobName", "buildId"],
      properties: {
        jobName: { type: "string" },
        buildId: { type: "string" }
      }
    }
  },
  {
    name: "NOTIFY_BUILD_SUCCESS",
    payload: {
      type: "object",
      required: ["jobName", "buildId"],
      properties: {
        jobName: { type: "string" },
        buildId: { type: "string" }
      }
    }
  },
  {
    name: "NOTIFY_BUILD_FAILURE",
    payload: {
      type: "object",
      required: ["jobName", "buildId", "error"],
      properties: {
        jobName: { type: "string" },
        buildId: { type: "string" },
        error: { type: "object" }
      }
    }
  },
  {
    name: "NOTIFY_BUILD_STEP_STARTED",
    payload: {
      type: "object",
      required: ["jobName", "stepName", "buildId"],
      properties: {
        stepName: { type: "string" },
        jobName: { type: "string" },
        buildId: { type: "string" }
      }
    }
  },
  {
    name: "NOTIFY_BUILD_STEP_SUCCESS",
    payload: {
      type: "object",
      required: ["jobName", "stepName", "buildId"],
      properties: {
        stepName: { type: "string" },
        jobName: { type: "string" },
        buildId: { type: "string" }
      }
    }
  },
  {
    name: "NOTIFY_BUILD_STEP_FAILURE",
    payload: {
      type: "object",
      required: ["jobName", "stepName", "buildId", "error"],
      properties: {
        jobName: { type: "string" },
        buildId: { type: "string" },
        stepName: { type: "string" },
        error: { type: "object" }
      }
    }
  }
]);
