const createActions = require("./index");

describe("createActions", () => {
  it("should create three actions constants", () => {
    const actions = createActions([{ name: "RUN_JOB" }]);
    expect(actions.RUN_JOB_STARTED).toEqual("RUN_JOB_STARTED");
    expect(actions.RUN_JOB_SUCCESS).toEqual("RUN_JOB_SUCCESS");
    expect(actions.RUN_JOB_FAILURE).toEqual("RUN_JOB_FAILURE");
  });
  it("should create corresponding functions", () => {
    const actions = createActions([{ name: "RUN_JOB" }]);
    expect(actions.runJobStarted()).toHaveProperty("action", "RUN_JOB_STARTED");
    expect(actions.runJobSuccess()).toHaveProperty("action", "RUN_JOB_SUCCESS");
    expect(actions.runJobFailure()).toHaveProperty("action", "RUN_JOB_FAILURE");
  });
  it("should validate parameters with ajv", () => {
    const actions = createActions([
      {
        name: "RUN_JOB",
        payload: {
          type: "object",
          required: ["jobName"],
          properties: {
            jobName: { type: "string", minLength: 2 },
            buildId: { type: "string" }
          }
        }
      }
    ]);
    expect(() => actions.runJobStarted()).toThrow();
    expect(() => actions.runJobStarted({})).toThrow();
    expect(() => actions.runJobStarted({ jobName: "s" })).toThrow();
    actions.runJobStarted({ jobName: "sree" });
  });
  it("should require error object on failure", () => {
    const actions = createActions([
      {
        name: "RUN_JOB",
        payload: {
          type: "object",
          required: ["jobName"],
          properties: {
            jobName: { type: "string", minLength: 2 }
          }
        }
      }
    ]);
    expect(() => actions.runJobFailure({ jobName: "something" })).toThrow();
    expect(() =>
      actions.runJobFailure({
        jobName: "something",
        error: {
          code: 300
        }
      })
    ).toThrow();

    actions.runJobFailure({
      jobName: "something",
      error: {
        message: "Not working",
        code: 300
      }
    });
  });
});
