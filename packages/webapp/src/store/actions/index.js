export const FETCH_BUILD_SUCCESS = "BUILD/FETCH_BUILD_SUCCESS";

export const fetchBuildSuccess = (jobName, responseData) => ({
  type: FETCH_BUILD_SUCCESS,
  payload: {
    jobName,
    buildId: responseData.id,
    data: responseData
  }
});
