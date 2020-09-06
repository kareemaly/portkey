#!/bin/node
const shell = require("shelljs");
const jobRunner = require("@portkey/job-runner");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function build({ store }) {
  await delay(1000);
  shell.exec("node --version");
}

async function deploy({ store }) {
  await delay(1000);
  shell.exec("node --version");
  await delay(2000);
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
