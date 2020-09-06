const Ajv = require("ajv");
const _ = require("lodash");
const errorSchema = require("../errorSchema");

class ValidationError extends Error {
  constructor(action, errors) {
    super(
      `Validation error occured when firing this action ${action}: ${JSON.stringify(
        errors,
        null,
        2
      )}`
    );
    this.name = "ValidationError";
    this.action = action;
    this.errors = errors;
  }
}

const validatePayloadOrThrow = (action, schema, object) => {
  const ajv = new Ajv({ allErrors: true, jsonPointers: true });
  require("ajv-errors")(ajv);
  const validate = ajv.compile({
    ...schema,
    additionalProperties: false
  });
  if (!validate(object)) {
    throw new ValidationError(action, validate.errors);
  }
};

const actionFn = (prefix, action, payloadSchema) => payload => {
  if (_.isObject(payloadSchema)) {
    validatePayloadOrThrow(action, payloadSchema, payload);
  }
  return {
    action: `${prefix}.${action}`,
    payload: {
      ...payload,
      sentAt: new Date()
    }
  };
};

const createActions = (prefix, actions) => {
  const object = {};
  actions.forEach(action => {
    object[action.name] = `${prefix}.${action.name}`;
    object[_.camelCase(action.name)] = actionFn(
      prefix,
      action.name,
      action.payload
    );
  });
  return object;
};

module.exports = createActions;
