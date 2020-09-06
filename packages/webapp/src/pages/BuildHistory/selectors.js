import values from "lodash/values";

const allBuilds = state => {
  return values(state.entities.builds).map(build => ({
    ...build,
    steps: build.steps.map(id => state.entities.buildSteps[id])
  }));
};

export default {
  allBuilds
};
