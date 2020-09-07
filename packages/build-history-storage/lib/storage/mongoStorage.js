module.exports = function buildHistoryMongoStorageCreator({ mongoInstance }) {
  const flowSchema = {
    startedAt: { type: Date },
    failureAt: { type: Date },
    successAt: { type: Date },
    status: { type: String, enum: ["started", "success", "failure"] },
    buildId: {
      type: String,
      ref: "Build"
    }
  };

  const buildStepSchema = new mongoInstance.Schema({
    _id: { type: String },
    name: { type: String, required: true },
    ...flowSchema
  });

  const buildSchema = new mongoInstance.Schema({
    _id: { type: String },
    jobName: { type: String, required: true },
    startedAt: { type: Date },
    ...flowSchema,
    messages: [
      {
        message: { type: String, required: true },
        sentAt: { type: Date, required: true }
      }
    ]
  });

  const buildModel = mongoInstance.model("Build", buildSchema);
  const buildStepModel = mongoInstance.model("BuildStep", buildStepSchema);

  function buildStarted(jobName, buildId, startedAt) {
    return buildModel
      .findOneAndUpdate(
        {
          _id: buildId
        },
        {
          _id: buildId,
          jobName,
          startedAt,
          status: "started"
        },
        {
          upsert: true
        }
      )
      .exec();
  }

  function buildSuccess(buildId, successAt) {
    return buildModel
      .findOneAndUpdate(
        { _id: buildId },
        { _id: buildId, successAt, status: "success" },
        { upsert: true }
      )
      .exec();
  }

  function buildFailure(buildId, failureAt) {
    return buildModel
      .findOneAndUpdate(
        { _id: buildId },
        { _id: buildId, failureAt, status: "failure" },
        { upsert: true }
      )
      .exec();
  }

  function buildStepStarted(buildId, stepId, stepName, startedAt) {
    return buildStepModel
      .findOneAndUpdate(
        { _id: stepId },
        { _id: stepId, buildId, status: "started", name: stepName, startedAt },
        { upsert: true }
      )
      .exec();
  }
  function buildStepSuccess(buildId, stepId, stepName, successAt) {
    return buildStepModel
      .findOneAndUpdate(
        { _id: stepId },
        { _id: stepId, buildId, status: "success", name: stepName, successAt },
        { upsert: true }
      )
      .exec();
  }
  function buildStepFailure(buildId, stepId, stepName, failureAt) {
    return buildStepModel
      .findOneAndUpdate(
        { _id: stepId },
        { _id: stepId, buildId, status: "failure", name: stepName, failureAt },
        { upsert: true }
      )
      .exec();
  }

  function addBuildMessage(buildId, message, sentAt) {
    return buildModel
      .findOneAndUpdate(
        { _id: buildId },
        { $push: { messages: { message, sentAt } } }
      )
      .exec();
  }

  function getById(buildId) {
    return buildModel
      .aggregate([
        { $match: { _id: buildId } },
        {
          $lookup: {
            from: "buildsteps",
            let: { buildId: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$buildId", "$$buildId"] } } }
            ],
            as: "steps"
          }
        }
      ])
      .then(items => items[0]);
  }

  function getByJobName(jobName) {
    return buildModel
      .aggregate([
        { $match: { jobName } },
        {
          $lookup: {
            from: "buildsteps",
            let: { buildId: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$buildId", "$$buildId"] } } }
            ],
            as: "steps"
          }
        }
      ])
      .exec();
  }

  return {
    getById,
    getByJobName,
    buildStarted,
    buildSuccess,
    buildFailure,
    buildStepStarted,
    buildStepSuccess,
    buildStepFailure,
    addBuildMessage
  };
};
