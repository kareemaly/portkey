import { schema } from "normalizr";

const buildStepSchema = new schema.Entity("buildSteps");

const buildSchema = new schema.Entity("builds", {
  steps: [buildStepSchema]
});

export { buildSchema, buildStepSchema };
