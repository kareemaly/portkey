const { Core, JobRunner, CliIO, InMemoryStore } = require("@portkey/core");

const core = new Core({
  io: new CliIO(),
  jobRunner: new JobRunner(),
  store: new InMemoryStore()
});

core.addJob("react-items-carousel-builder", {
  github: {
    name: "bitriddler/react-items-carousel",
    jobPath: "ci/build.js"
  }
});

core.runJob("react-items-carousel-builder");
