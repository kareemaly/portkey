import React from "react";
import get from "lodash/get";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Box from "@material-ui/core/Box";
import BuildStepInfo from "../../components/BuildStepInfo";
import events from "./events";
import useApiRequest from "../../api/useApiRequest";
import useDispatchIoEvents from "../../utils/react/useDispatchIoEvents";
import * as localActions from "../../store/actions";

const BuildDetails = () => {
  useDispatchIoEvents(events);
  const dispatch = useDispatch();
  const { buildId, jobName } = useParams();
  const { isLoading, isSuccess, error } = useApiRequest(
    {
      url: `/build/${buildId}`
    },
    {
      onSuccess: data => dispatch(localActions.fetchBuildSuccess(jobName, data))
    }
  );
  const build = useSelector(state => {
    const builds = get(state, ["builds", "data", jobName], []);
    return builds.find(b => b.id === buildId);
  });

  return (
    <Box m={2}>
      {build &&
        build.steps.map(step => <BuildStepInfo step={step} key={step.name} />)}
    </Box>
  );
};

export default BuildDetails;
