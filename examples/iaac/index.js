core.configureGithubAccess({
  sshKey: "~/.ssh/id_rsa"
});

core.set("credentials", {});
core.set("slack", slackInstance);

core.configureSeedJob({
  name: "op-wsl-admin",
  github: "bitriddler/op-wsl-admin",
  jobPath: "job/deploy.js",
  workflow: [
    {
      event: "pull_request",
      condition: body =>
        ["opened", "edited", "reopened", "synchronize"].indexOf(body.action)
    }
  ]
});

core.configureSeedJob({
  name: "manual",
  job: require("./jobs/manual")
});

/// manual.js

/// deploy.js
const { cli } = require("@portkey/utils");

module.exports = async core => {
  const slackInstance = core.get("slack");
  const output = await core.runStep({
    name: "Build",
    run: async () => {}
  });

  await core.ui.askConfirm("You sure you want to continue?");

  await core.runStep({
    name: "Deploy",
    run: async () => {
      const { status, output } = core.getStepRunDetails();
    }
  });
};

/// fakeRunner.js
const core = new Core();

core.setGithubHook({});

deploy(core);
