import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { IndexView } from "./components/pages/IndexView";
import { MultisigCreateView } from "./components/pages/multisig/MultisigCreateView";
import { useAnalytics } from "./utils/useAnalytics";

export const Routes: React.FC = () => {
  useAnalytics();
  return (
    <Switch>
      <Route path="/wallet/new" component={MultisigCreateView} />
      <Route exact path="/" component={IndexView} />
      <Redirect to="/" />
    </Switch>
  );
};
