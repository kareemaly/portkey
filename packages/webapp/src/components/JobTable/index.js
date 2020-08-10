import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  row: {
    cursor: "pointer"
  }
});

export default function SimpleTable({ jobs, goToJob }) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Job Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map(job => (
            <TableRow
              className={classes.row}
              hover
              onClick={e => goToJob(e, job)}
              key={job.jobName}
            >
              <TableCell component="th" scope="row">
                {job.jobName}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
