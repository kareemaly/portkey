const { v4: uuid } = require("uuid");
const mongoose = require("mongoose");
const _ = require("lodash");
const buildHistoryCreator = require("../lib/storage/mongoStorage");

const connect = () =>
  new Promise((resolve, reject) => {
    const mongoInstance = new mongoose.Mongoose();
    mongoInstance.connect("mongodb://localhost/portkey", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    mongoInstance.set("useFindAndModify", false);
    mongoInstance.connection.on("error", error => {
      reject("connection error");
    });
    mongoInstance.connection.once("open", function() {
      console.log("Connected to database");
      resolve(mongoInstance);
    });
  });

const run = async () => {
  const mongoInstance = await connect();
  const buildHistory = buildHistoryCreator({ mongoInstance });
  const buildId = uuid();
  const jobName = "frontend-builder";
  const startedAt = new Date();
  const successAt = new Date();
  successAt.setDate(startedAt.getDate() + 1);
  const failureAt = new Date();
  failureAt.setDate(startedAt.getDate() + 2);
  let build;

  await buildHistory.buildStarted(jobName, buildId, startedAt);
  build = await buildHistory.getById(buildId);
  if (!_.isMatch(build, { status: "started", startedAt })) {
    console.log({ build, startedAt });
    throw new Error("Build started not matching");
  }

  await buildHistory.buildSuccess(buildId, successAt);
  build = await buildHistory.getById(buildId);
  if (!_.isMatch(build, { status: "success", successAt })) {
    console.log({ build, successAt });
    throw new Error("Build success not matching");
  }

  await buildHistory.buildFailure(buildId, failureAt);
  build = await buildHistory.getById(buildId);
  if (!_.isMatch(build, { status: "failure", failureAt })) {
    console.log({ build, failureAt });
    throw new Error("Build failure not matching");
  }

  const promises = ["Build", "Deploy", "Clean"].map(async name => {
    const stepId = uuid();
    console.log(`Running`, { name, buildId, stepId });
    await buildHistory.buildStepStarted(buildId, stepId, name, startedAt);
    build = await buildHistory.getById(buildId);
    step = build.steps.find(s => s._id === stepId);
    if (!_.isMatch(step, { status: "started", startedAt })) {
      console.log({ step, startedAt });
      throw new Error("Step started not matching");
    }

    await buildHistory.buildStepSuccess(buildId, stepId, name, successAt);
    build = await buildHistory.getById(buildId);
    step = build.steps.find(s => s._id === stepId);
    if (!_.isMatch(step, { status: "success", successAt })) {
      console.log({ step, startedAt });
      throw new Error("Step success not matching");
    }

    await buildHistory.buildStepFailure(buildId, stepId, name, failureAt);
    build = await buildHistory.getById(buildId);
    step = build.steps.find(s => s._id === stepId);
    if (!_.isMatch(step, { status: "failure", failureAt })) {
      console.log({ step, startedAt });
      throw new Error("Step failure not matching");
    }
  });

  await Promise.all(promises);

  const mPromises = ["1", "2", "3"].map(message => {
    return buildHistory.addBuildMessage(buildId, message, new Date());
  });

  await Promise.all(mPromises);

  build = await buildHistory.getById(buildId);
  if (build.messages.map(({ message }) => message).join(",") !== "1,2,3") {
    console.log(build);
    throw new Error("Messages not matching");
  }

  console.log("final build", build);
  console.log("==========> Success");
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
