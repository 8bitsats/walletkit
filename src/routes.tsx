import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { ArrowsView } from "./components/pages/ArrowsView";
import { ArrowView } from "./components/pages/ArrowView";
import { IndexView } from "./components/pages/IndexView";
import { IssueView } from "./components/pages/IssueView";
import { useAnalytics } from "./utils/useAnalytics";

export const Routes: React.FC = () => {
  useAnalytics();
  return (
    <Switch>
      <Route path="/issue" component={IssueView} />

      <Route path="/arrow/:arrowMint" component={ArrowView} />
      <Route path="/arrows" component={ArrowsView} />
      <Route exact path="/" component={IndexView} />
      <Redirect to="/" />
    </Switch>
  );
};
