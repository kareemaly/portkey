import jobActions from "@portkey/job/lib/actions";
import outputActions from "@portkey/job-output-stream/lib/actions";

export default [
  jobActions.NOTIFY_BUILD_STEP_FAILURE,
  jobActions.NOTIFY_BUILD_STEP_SUCCESS,
  jobActions.NOTIFY_BUILD_STEP_STARTED,
  jobActions.NOTIFY_BUILD_FAILURE,
  jobActions.NOTIFY_BUILD_SUCCESS,
  jobActions.NOTIFY_BUILD_STARTED,
  outputActions.SEND
];
