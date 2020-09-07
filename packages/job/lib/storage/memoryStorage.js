const Ajv = require("ajv");
const _ = require("lodash");
const ValidationError = require("../utils/ValidationError");
const jobSchema = require("../utils/jobSchema");

const jobs = {};

const all = () => _.values(jobs);

const get = jobName => jobs[jobName];

const add = (jobName, jobData) => {
  const job = {
    jobName,
    jobData
  };
  const ajv = new Ajv({ allErrors: true, jsonPointers: true });
  const validate = ajv.compile(jobSchema);
  if (!validate(job)) {
    throw new ValidationError(validate.errors);
  }
  jobs[jobName] = job;
};

module.exports = {
  all,
  get,
  add
};
