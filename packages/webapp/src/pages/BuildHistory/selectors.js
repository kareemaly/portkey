import values from "lodash/values";

const allBuilds = state => {
  return [];
  // return values(state.entities.builds).map(build => ({
  //   ...build,
  //   steps: build.stepIds.map(id => state.entities.buildSteps[id])
  // }));
};

export default {
  allBuilds
};
