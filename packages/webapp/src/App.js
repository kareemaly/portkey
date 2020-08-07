import React from "react";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import BuildDetails from "./pages/BuildDetails";
import BuildHistory from "./pages/BuildHistory";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Layout>
      <Router>
        <Switch>
          <Route path="/job/:jobName/build/:buildId">
            <BuildDetails />
          </Route>
          <Route path="/job/:jobName">
            <BuildHistory />
          </Route>
          <Route path="/">
            <Dashboard />
          </Route>
        </Switch>
      </Router>
    </Layout>
  );
}
