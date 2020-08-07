import timediff from "timediff";

const getBuildStepTime = (step, now) => {
  return timediff(
    step.startedAt,
    step.successAt || step.failureAt || now,
    ({ hours, minutes, seconds }) => {
      let str = "";
      if (hours !== 0) {
        str += `${hours} Hours, `;
      }
      if (hours !== 0 || minutes !== 0) {
        str += `${minutes} Minutes, `;
      }
      return `${str}${seconds} Seconds`;
    }
  );
};

export default getBuildStepTime;
