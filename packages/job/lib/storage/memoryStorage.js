const _ = require("lodash");

const jobs = {};

const all = () => _.values(jobs);

const get = jobName => jobs[jobName];

const add = (jobName, job) => {
  jobs[jobName] = job;
};

module.exports = {
  all,
  get,
  add
};
