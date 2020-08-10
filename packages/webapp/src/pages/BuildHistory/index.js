import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import BuildSteps from "../../components/BuildSteps";
import useApiRequest from "../../api/useApiRequest";
import events from "./events";
import * as localActions from "../../store/actions";
import useDispatchIoEvents from "../../utils/react/useDispatchIoEvents";

const BuildHistory = ({ dispatch, builds }) => {
  const { jobName } = useParams();
  const jobBuilds = builds[jobName] || [];
  const {
    isLoading: isBuildLoading,
    isSuccess: isBuildSuccess,
    error: buildError,
    call: buildJob
  } = useApiRequest(
    {
      url: "/job/start",
      method: "POST",
      data: { jobName }
    },
    { lazy: true }
  );

  const {
    data: job,
    isLoading: isFetchingJob,
    isSuccess: fetchJobSuccess,
    error: fetchJobError
  } = useApiRequest({ url: `/job/${jobName}` });

  const {
    data: apiBuilds,
    isLoading: isFetchingBuilds,
    isSuccess: fetchBuildsSuccess,
    error: fetchBuildsError
  } = useApiRequest({ url: `/build`, params: { jobName } });

  React.useEffect(() => {
    if (fetchBuildsSuccess) {
      apiBuilds.forEach(apiBuild => {
        dispatch(localActions.fetchBuildSuccess(jobName, apiBuild));
      });
    }
  }, [fetchBuildsSuccess]);

  useDispatchIoEvents(events);

  const history = useHistory();

  const onStepClick = React.useCallback((e, buildId, stepId) => {
    history.push(`/job/${jobName}/build/${buildId}`);
  });

  return (
    <Grid direction={"column"} container>
      <Grid item>
        <Button
          variant="contained"
          disabled={isBuildLoading}
          color="secondary"
          onClick={buildJob}
        >
          Build
        </Button>
      </Grid>
      <Grid item>
        <Box mt={2}>
          {jobBuilds.map(build => (
            <BuildSteps
              onStepClick={onStepClick}
              key={build.id}
              build={build}
            />
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default connect(state => ({
  builds: state.builds.data
}))(BuildHistory);
