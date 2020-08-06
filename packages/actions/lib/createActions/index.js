const Ajv = require("ajv");
const _ = require("lodash");
const errorSchema = require("../errorSchema");
const appends = ["STARTED", "SUCCESS", "FAILURE"];

const validatePayloadOrThrow = (action, schema, object) => {
  const ajv = new Ajv();
  const validate = ajv.compile({
    ...schema,
    additionalProperties: false
  });
  if (!validate(object)) {
    throw {
      action,
      validationErrors: validate.errors
    };
  }
};

const actionFn = (action, payloadSchema) => payload => {
  if (_.isObject(payloadSchema)) {
    validatePayloadOrThrow(action, payloadSchema, payload);
  }
  return {
    action,
    payload
  };
};
const createActions = actions => {
  const object = {};
  actions.forEach(action => {
    object[action.name] = `${action.name}`;
    object[_.camelCase(action.name)] = actionFn(action.name, action.payload);
    appends.forEach(append => {
      const value = `${action.name}_${append}`;
      object[value] = value;
      object[_.camelCase(value)] = actionFn(value);
    });
  });
  return object;
};

module.exports = createActions;