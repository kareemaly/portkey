module.exports = {
  type: "object",
  required: ["jobName"],
  properties: {
    jobName: {
      type: "string"
    },
    jobPath: {
      type: "string"
    }
  }
};
