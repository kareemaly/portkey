const { uiEvents } = require("@portkey/ui");
const events = require("./events");

const jobs = {};

const getJob = async (eventStream, name) => {
  if (jobs[name].github) {
    eventStream.emit(
      uiEvents.showMessage({
        type: "info",
        message: `Cloning repo ${jobs[name].github.name}`
      })
    );
    return getJobFromGithub({
      job: jobs[name],
      tmpDir: options.tmpDir
    });
  } else {
    return jobs[name].jobPath;
  }
};

module.exports = eventStream => {
  events.listen(events.ADD_JOB, {}, () => {
    if (jobs[name]) {
      eventStream.emit(
        events.addJobError(new Error(`Job with name "${name}" already exists`))
      );
    }
    try {
      jobSchema.validate(job);
      jobs[name] = job;
      eventStream.emit(events.addJobSuccess());
    } catch (err) {
      eventStream.emit(events.addJobError(err));
    }
  });

  events.listen(events.RUN_JOB, {}, () => {});
};
