const Ajv = require("ajv");
const jobSchema = require("./jobSchema");

module.exports = job => {
  const ajv = new Ajv();
  const validate = ajv.compile(jobSchema);
  if (!validate(job)) {
    throw validation.errors;
  }
};
