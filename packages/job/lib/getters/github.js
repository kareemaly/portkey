const debug = require("debug")("portkey:getJobFromGithub");
const { actions: outputStreamActions } = require("@portkey/job-output-stream");
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

const getJobFromGithub = async ({ store, githubUrl, buildId }) => {
  const tmpDir = getTempDir();

  debug("Checking if temp dir exists %s", tmpDir);
  if (!(await exists(tmpDir))) {
    debug("Creating temp dir %s", tmpDir);
    await mkdir(tmpDir);
  }

  debug("Cloning repo %O", { githubUrl, buildId, tmpDir });
  const { stdout, stderr } = await execP(`git clone ${githubUrl} ${buildId}`, {
    cwd: tmpDir
  });

  store.dispatch(
    outputStreamActions.send({
      buildId,
      message: stderr ? stderr.toString() : stdout.toString()
    })
  );

  const repoFullPath = path.join(tmpDir, buildId);

  return {
    repoFullPath
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
