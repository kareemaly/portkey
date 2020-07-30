const { Core, JobRunner, CliIO, InMemoryStore } = require("@portkey/core");

const core = new Core({
  io: new CliIO(),
  jobRunner: new JobRunner(),
  store: new InMemoryStore()
});

core.store.set("credentials", { dbPassword: "secret" });

core.addJob("frontend-builder", {
  job: core => ({
    prepare: context => {},
    steps: [
      {
        name: "Lint",
        run: async (_, context) => {
          return new Promise(resolve => setTimeout(resolve, 1000));
        }
      },
      { name: "Tests", run: () => console.log("Running Tests") },
      { name: "Build", run: () => console.log("Running Build") },
      { name: "Upload", run: () => console.log("Running Upload") },
      { name: "Invalidate Cache", run: () => console.log("Invalidating Cache") }
    ]
  })
});

core.runJob("frontend-builder");
