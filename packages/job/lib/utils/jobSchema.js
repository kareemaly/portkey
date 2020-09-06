module.exports = {
  type: "object",
  required: ["jobName"],
  properties: {
    jobName: { type: "string" },
    jobPath: { type: "string" },
    github: {
      type: "object",
      required: ["url", "jobPath", "events"],
      properties: {
        url: { type: "string" },
        jobPath: {
          type: "string",
          pattern: ".*.js"
        },
        events: {
          type: "array",
          items: {
            type: "object",
            required: ["event", "conditions"],
            properties: {
              event: { type: "string" },
              conditions: {
                type: "array",
                items: {
                  type: "object",
                  required: ["type", "key", "value"],
                  properties: {
                    type: { enum: ["oneOf", "equal"] },
                    key: { type: "string" },
                    value: {
                      oneOf: [
                        {
                          type: "array",
                          items: { type: "string" }
                        },
                        { type: "string" }
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
