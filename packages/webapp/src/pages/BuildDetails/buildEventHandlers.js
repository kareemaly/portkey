import { actions as outputActions } from "@portkey/job-output-stream";

export default (buildId, setBuild) => {
  return {
    [outputActions.SEND]: payload => {
      console.log("new message recevied", payload);
    }
  };
};
