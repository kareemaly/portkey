import { schema } from "normalizr";

const buildStepSchema = new schema.Entity(
  "buildSteps",
  {},
  {
    idAttribute: "_id"
  }
);

const buildSchema = new schema.Entity(
  "builds",
  {
    steps: [buildStepSchema]
  },
  {
    idAttribute: "_id"
  }
);

export { buildSchema, buildStepSchema };
