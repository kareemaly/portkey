import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import * as colors from "@material-ui/core/colors";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import getBuildStepTime from "../../utils/build/getBuildStepTime";
import useTimer from "../../utils/react/useTimer";

const useRootStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  }
}));

const getStepBgColor = ({ status }) => {
  switch (status) {
    case "started":
      return colors.grey[100];
    case "success":
      return colors.green[100];
    case "failure":
      return colors.red[100];
  }
};

const useStepStyles = makeStyles(theme => ({
  buildStep: {
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: props => getStepBgColor(props.step)
  },
  buildStepName: {},
  buildStepTime: {}
}));

const BuildStep = ({ step, onStepClick }) => {
  const classes = useStepStyles({ step });
  const now = useTimer();
  return (
    <Box
      p={3}
      mr={2}
      className={classes.buildStep}
      onClick={e => onStepClick(e, step._id)}
    >
      <div className={classes.buildStepName}>
        <Typography variant={"subtitle2"}>{step.name}</Typography>
      </div>
      <div className={classes.buildStepTime}>
        <Typography variant="caption" color="textSecondary">
          {getBuildStepTime(step, now)}
        </Typography>
      </div>
    </Box>
  );
};

const BuildSteps = ({ build, onStepClick }) => {
  const classes = useRootStyles();
  return (
    <Grid container>
      {build.steps.map(step => (
        <Grid item key={step._id}>
          <Box mb={2}>
            <BuildStep
              onStepClick={(e, stepId) => onStepClick(e, build._id, stepId)}
              step={step}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default BuildSteps;
