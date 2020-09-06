const debug = require("debug")("portkey:getJobFromGithub");
const path = require("path");
const rimraf = require("rimraf");
const fs = require("fs");
const { exec } = require("child_process");
const { promisify } = require("util");

const rimrafP = promisify(rimraf);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);
const execP = promisify(exec);

const getTempDir = () =>
  process.env.TEMP_DIR || path.join(process.cwd(), "tmp");

const getJobFromGithub = async ({ job, buildId }) => {
  const tmpDir = getTempDir();

  debug("Checking if temp dir exists %s", tmpDir);
  if (!(await exists(tmpDir))) {
    debug("Creating temp dir %s", tmpDir);
    await mkdir(tmpDir);
  }

  debug("Cloning repo %O", { job, buildId, tmpDir });
  const { stdout, stderr } = await execP(
    `git clone git@github.com:${job.github.name} ${buildId}`,
    {
      cwd: tmpDir
    }
  );

  if (stderr) {
    throw new Exception(stderr.toString());
  }

  const repoFullPath = path.join(tmpDir, buildId);

  return {
    jobPath: path.join(repoFullPath, job.github.jobPath)
  };
};

const cleanGithubJob = async ({ buildId }) => {
  const repoFullPath = path.join(getTempDir(), buildId);
  await rimrafP(repoFullPath);
};

module.exports = {
  getJobFromGithub,
  cleanGithubJob
};
