module.exports = {
  type: "object",
  required: ["jobName", "jobPath"],
  properties: {
    jobName: { type: "string" },
    jobPath: { type: "string" },
    githubUrl: { type: "string" }
  }
};
