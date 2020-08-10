const createActions = require("./index");

describe("createActions", () => {
  it("should create action constant", () => {
    const actions = createActions("JOB", [{ name: "RUN_JOB" }]);
    expect(actions.RUN_JOB).toEqual("JOB.RUN_JOB");
  });
  it("should create corresponding function", () => {
    const actions = createActions("JOB", [{ name: "RUN_JOB" }]);
    expect(actions.runJob()).toHaveProperty("action", "JOB.RUN_JOB");
  });
  it("should validate parameters with ajv", () => {
    const actions = createActions("JOB", [
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
    expect(() => actions.runJob()).toThrow();
    expect(() => actions.runJob({})).toThrow();
    expect(() => actions.runJob({ jobName: "s" })).toThrow();
    actions.runJob({ jobName: "sree" });
  });
});
