import React from "react";
import { useHistory } from "react-router-dom";
import keys from "lodash/keys";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { actions as jobActions } from "@portkey/job";
import BuildSteps from "../../components/BuildSteps";
import useApiRequest from "../../api/useApiRequest";
import JobTable from "../../components/JobTable";
import Layout from "../../components/Layout";
import ErrorView from "../../components/ErrorView";
import CircularProgress from "@material-ui/core/CircularProgress";
import io from "../../api/socketIO";
import buildEventHandlers from "./buildEventHandlers";

const BuildHistory = props => {
  const { jobName } = useParams();
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

  const [builds, setBuilds] = React.useState([]);

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
    error: fetchBuildsError,
    call: refreshBuilds
  } = useApiRequest({ url: `/build`, params: { jobName } });

  React.useEffect(() => {
    if (fetchBuildsSuccess) {
      setBuilds(apiBuilds);
    }
  }, [fetchBuildsSuccess]);

  React.useEffect(() => {
    const eventHandlers = buildEventHandlers(jobName, setBuilds);
    keys(eventHandlers).forEach(action => io.on(action, eventHandlers[action]));
    return function cleanup() {
      keys(eventHandlers).forEach(action =>
        io.off(action, eventHandlers[action])
      );
    };
  }, []);

  React.useEffect(() => {
    if (isBuildSuccess) {
      refreshBuilds();
    }
  }, [isBuildSuccess]);

  const history = useHistory();

  const onStepClick = React.useCallback((e, buildId, stepId) => {
    history.push(`/job/${jobName}/build/${buildId}`);
  });

  return (
    <Layout>
      <Grid justify={"center"} container>
        <Grid item>
          <Box m={2}>
            <Button
              variant="contained"
              disabled={isBuildLoading}
              color="secondary"
              onClick={buildJob}
            >
              Build
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item>
          <Box m={2}>
            {builds.map(build => (
              <BuildSteps
                onStepClick={onStepClick}
                key={build.id}
                build={build}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default BuildHistory;
