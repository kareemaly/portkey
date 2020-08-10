const debug = require("debug")("portkey:getJobFromGithub");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { promisify } = require("util");

const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

const getJobFromGithub = async ({ job, cli, tmpDir }) => {
  debug("Checking if temp dir exists %s", tmpDir);
  if (!(await exists(tmpDir))) {
    debug("Creating temp dir %s", tmpDir);
    await mkdir(tmpDir);
  }
  const repoTempName = uuidv4();
  debug("Cloning repo %O", { job, cli, tmpDir });
  await cli.execCommand(
    "git",
    ["clone", `git@github.com:${job.github.name}`, repoTempName],
    {
      cwd: tmpDir
    }
  );

  return require(path.join(tmpDir, repoTempName, job.github.jobPath));
};

module.exports = getJobFromGithub;
