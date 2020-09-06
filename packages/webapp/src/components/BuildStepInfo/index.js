import React from "react";
import dateFormat from "dateformat";
import { makeStyles } from "@material-ui/core/styles";
import * as colors from "@material-ui/core/colors";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import timediff from "timediff";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import getBuildStepTime from "../../utils/build/getBuildStepTime";
import useTimer from "../../utils/react/useTimer";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  messagesWrapper: {
    display: "flex",
    flexDirection: "column",
    background: colors.grey[100],
    color: colors.grey[900]
  }
}));

const getStepSubTitle = step => {
  return [
    `Started At: ${dateFormat(step.startedAt, "mediumDate")}`,
    `Build Time: ${getBuildStepTime(step)} `
  ].join(", ");
};

const getBetween = (messages, from, to) => {
  return messages.filter(message => {
    return (
      new Date(message.timestamp) < new Date(to) &&
      new Date(message.timestamp) > new Date(from)
    );
  });
};

const BuildStepInfo = ({ messages, step }) => {
  const classes = useStyles();
  const now = useTimer();
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={step.name}
      >
        <Typography>
          {step.name} <small>[{getStepSubTitle(step)}]</small>
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.messagesWrapper}>
        {getBetween(
          messages,
          step.startedAt,
          step.successAt || step.failureAt || Date.now()
        ).map(({ message, timestamp }) => (
          <Box mb={1} key={timestamp}>
            <Grid container>
              <Grid item>
                <Box mr={2}>
                  <Typography variant={"caption"}>
                    {dateFormat(timestamp, "mediumTime")}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Typography variant={"body2"}>{message}</Typography>
              </Grid>
            </Grid>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default BuildStepInfo;
