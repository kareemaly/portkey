import React from "react";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import useApiRequest from "../../api/useApiRequest";
import JobTable from "../../components/JobTable";
import Layout from "../../components/Layout";
import ErrorView from "../../components/ErrorView";
import CircularProgress from "@material-ui/core/CircularProgress";

const Dashboard = props => {
  const history = useHistory();
  const { data, isLoading, isSuccess, error } = useApiRequest({
    url: "/job"
  });
  const onJobClick = React.useCallback((e, job) => {
    history.push(`/job/${job.jobName}`);
  });
  return (
    <Layout>
      <Grid justify={"center"} container>
        <Grid item>
          <Box m={2}>
            {isLoading && <CircularProgress />}
            {isSuccess && <JobTable goToJob={onJobClick} jobs={data} />}
            {error && <ErrorView error={error} />}
          </Box>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;
