const Ajv = require("ajv");
const _ = require("lodash");
const errorSchema = require("../errorSchema");
const appends = ["STARTED", "SUCCESS", "FAILURE"];

const validatePayloadOrThrow = (schema, object) => {
  const ajv = new Ajv();
  const validate = ajv.compile({
    ...schema,
    additionalProperties: false
  });
  if (!validate(object)) {
    throw validate.errors;
  }
};

const actionFn = (action, payloadSchema) => payload => {
  if (_.isObject(payloadSchema)) {
    validatePayloadOrThrow(payloadSchema, payload);
  }
  return {
    action,
    payload
  };
};

const getFailurePayloadSchema = schema => ({
  ...schema,
  required: [...schema.required, "error"],
  properties: {
    ...schema.properties,
    error: errorSchema
  }
});

const createActions = actions => {
  const object = {};
  actions.forEach(action => {
    object[action.name] = `${action.name}`;
    object[_.camelCase(action.name)] = actionFn(action.name, action.payload);
    appends.forEach(append => {
      const value = `${action.name}_${append}`;
      object[value] = value;
      object[_.camelCase(value)] = actionFn(
        value,
        append === "FAILURE" && _.isObject(action.payload)
          ? getFailurePayloadSchema(action.payload)
          : action.payload
      );
    });
  });
  return object;
};

module.exports = createActions;
