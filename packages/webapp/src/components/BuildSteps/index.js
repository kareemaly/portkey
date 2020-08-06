import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import * as colors from "@material-ui/core/colors";
import timediff from "timediff";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: props => getStepBgColor(props.step)
  },
  buildStepName: {},
  buildStepTime: {}
}));
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
      return `${seconds} Seconds`;
    }
  );
};

const BuildStep = ({ step, onStepClick }) => {
  const classes = useStepStyles({ step });
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return function cleanup() {
      clearInterval(id);
    };
  }, []);
  return (
    <Box
      p={3}
      m={1}
      className={classes.buildStep}
      onClick={e => onStepClick(e, step.id)}
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
    <div className={classes.root}>
      {build.steps.map(step => (
        <BuildStep
          onStepClick={(e, stepId) => onStepClick(e, build.id, stepId)}
          key={step.id}
          step={step}
        />
      ))}
    </div>
  );
};

export default BuildSteps;
