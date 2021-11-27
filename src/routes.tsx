import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { IndexView } from "./components/pages/IndexView";
import { IssueView } from "./components/pages/IssueView";
import { MultisigCreateView } from "./components/pages/multisig/MultisigCreateView";
import { useAnalytics } from "./utils/useAnalytics";

export const Routes: React.FC = () => {
  useAnalytics();
  return (
    <Switch>
      <Route path="/multisig/create" component={MultisigCreateView} />

      <Route path="/issue" component={IssueView} />

      <Route exact path="/" component={IndexView} />
      <Redirect to="/" />
    </Switch>
  );
};
