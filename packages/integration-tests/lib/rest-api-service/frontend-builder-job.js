#!/bin/node
const shell = require("shelljs");
const jobRunner = require("@portkey/job-runner");

async function build({ store }) {
  shell.exec("node --version");
}

async function deploy({ store }) {
  shell.exec("node --version");
}

jobRunner({
  steps: [
    {
      name: "Build",
      run: build
    },
    {
      name: "Deploy",
      run: deploy
    }
  ]
});
