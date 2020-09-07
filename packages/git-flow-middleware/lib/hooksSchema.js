const gitEvents = {
  type: "array",
  items: {
    type: "object",
    required: ["jobName", "event", "conditions"],
    properties: {
      jobName: { type: "string" },
      event: { type: "string" },
      jobEnvironment: {
        type: "array",
        items: {
          type: "object",
          required: ["selector", "key"],
          properties: {
            selector: { type: "string" },
            key: { type: "string" }
          }
        }
      },
      conditions: {
        type: "array",
        items: {
          type: "object",
          required: ["type", "selector", "value"],
          properties: {
            type: { enum: ["oneOf", "equal"] },
            selector: { type: "string" },
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
};

module.exports = {
  type: "array",
  items: {
    type: "object",
    required: ["repository", "events"],
    properties: {
      repository: { type: "string" },
      events: gitEvents
    }
  }
};
