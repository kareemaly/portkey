import React from "react";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import BuildDetails from "./pages/BuildDetails";
import BuildHistory from "./pages/BuildHistory";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/job/:jobName/build/:id">
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
  );
}
