import React from "react";
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const ErrorView = ({ error }) => {
  return (
    <Paper component={Box} p={2}>
      <Typography color={'error'}>{error.message}</Typography>
    </Paper>
  );
}

export default ErrorView;
