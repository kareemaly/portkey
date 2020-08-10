const Ajv = require("ajv");
const _ = require("lodash");
const errorSchema = require("../errorSchema");

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

const actionFn = (prefix, action, payloadSchema) => payload => {
  if (_.isObject(payloadSchema)) {
    validatePayloadOrThrow(action, payloadSchema, payload);
  }
  return {
    action: `${prefix}.${action}`,
    payload
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
