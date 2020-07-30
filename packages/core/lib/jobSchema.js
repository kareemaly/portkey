const Joi = require("@hapi/joi");

const githubEventHandlerSchema = Joi.object({
  event: Joi.string().required(),
  condition: Joi.function().required()
});

const githubSchema = Joi.object({
  name: Joi.string()
    .required()
    .pattern(new RegExp("^(.*)/(.*)$"))
    .error(
      new Error("Github option need to be in this format 'username/repo'")
    ),
  jobPath: Joi.string().required(),
  workflow: Joi.array().items(githubEventHandlerSchema)
});

const stepSchema = Joi.object({
  name: Joi.string().required(),
  run: Joi.function().required()
});

const jobSchema = Joi.object({
  github: githubSchema,
  steps: Joi.array().items(stepSchema)
});

module.exports = jobSchema;
