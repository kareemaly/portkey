import React from "react";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Header from "../Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Grid container justify="center">
        <Grid item xs={12} lg={8}>
          <Box mt={2}>{children}</Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Layout;
