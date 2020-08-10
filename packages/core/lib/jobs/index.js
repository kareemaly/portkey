const jobSchema = require("./jobSchema");

const jobs = {};

module.exports = () => {
  return {
    addJob: () => {
      if (jobs[name]) {
        throw new Error(`Job with name "${name}" already exists`);
      }
      if (jobSchema.validate(job)) {
        jobs[name] = job;
      }
    },
    runJob: () => jobs[name]
  };
};
