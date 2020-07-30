const debug = require("debug")("portkey:Core");
const fs = require("fs");
const { cli } = require("@portkey/utils");
const jobSchema = require("./jobSchema");
const getJobFromGithub = require("./jobGetters/getJobFromGithub");
const defaultOptions = require("./defaultOptions");

class PortKeyCore {
  constructor({ io, jobRunner, store }, options) {
    if (!io) {
      throw new Error(`IO is required`);
    }
    if (!store) {
      throw new Error(`Store is required`);
    }
    if (!jobRunner) {
      throw new Error(`Job runner is required`);
    }
    this.options = { ...defaultOptions, ...options };
    this.io = io;
    this.cli = cli(this);
    this.jobRunner = jobRunner;
    this.store = store;
    this.jobs = {};
  }

  addJob(name, job) {
    if (this.jobs[name]) {
      throw new Error(`Job with name "${name}" already exists`);
    }
    if (jobSchema.validate(job)) {
      this.jobs[name] = job;
    }
  }

  _failIfNoJob(name) {
    if (!this.jobs[name]) {
      throw new Error(`Job with name "${name}" doesn't exist`);
    }
  }

  async _getJob(name) {
    if (this.jobs[name].github) {
      this.io.showMessage({
        type: "info",
        message: `Cloning repo ${this.jobs[name].github.name}`
      });
      return getJobFromGithub({
        job: this.jobs[name],
        cli: this.cli,
        tmpDir: this.options.tmpDir
      });
    } else {
      return this.jobs[name].job(this);
    }
  }

  async runJob(name) {
    this._failIfNoJob(name);
    const job = await this._getJob(name);
    await this.jobRunner.prepare(this.io, name, job);
    return this.jobRunner.run(this.io, job);
  }
}

module.exports = PortKeyCore;
