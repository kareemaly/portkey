import { actions as jobActions } from "@portkey/job";

export default [
  jobActions.NOTIFY_BUILD_STEP_FAILURE,
  jobActions.NOTIFY_BUILD_STEP_SUCCESS,
  jobActions.NOTIFY_BUILD_STEP_STARTED,
  jobActions.NOTIFY_BUILD_FAILURE,
  jobActions.NOTIFY_BUILD_SUCCESS,
  jobActions.NOTIFY_BUILD_STARTED
];
