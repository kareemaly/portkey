const jobs = {};

const get = jobName => jobs[jobName];

const add = job => (jobs[job.jobName] = job);

module.exports = {
  get,
  add
};
