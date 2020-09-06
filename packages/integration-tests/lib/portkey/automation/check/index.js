const shell = require("shell");

module.exports = (store, { buildId }) => {
  shell.cd("packages/integration-tests/portkey/automation/check");
  return {
    steps: [
      {
        name: "Lint",
        run: async () => {
          shell.exec("node --version");
        }
      }
    ]
  };
};
