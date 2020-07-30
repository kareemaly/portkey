const _ = require("lodash");

class JobRunner {
  constructor() {
    this.jobContexts = {};
  }

  async prepare(io, name, job) {
    io.showMessage({
      type: "info",
      message: `Preparing environment for ${name}`
    });
    this.jobContexts[name] = {};

    if (_.isFunction(job.prepare)) {
      await job.prepare(this.jobContexts[name]);
    }
  }

  async run(io, job) {
    return job.steps.reduce(async (promise, step) => {
      const result = await promise;
      io.showMessage({
        type: "info",
        message: `Running Step: ${step.name}`
      });
      return step.run(result, this.jobContexts[name]);
    }, Promise.resolve());
  }
}

module.exports = JobRunner;
