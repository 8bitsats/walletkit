import React from "react";
import { Route, Switch } from "react-router-dom";

import { MainLayout } from "./components/layout/MainLayout";
import { IndexView } from "./components/pages/IndexView";
import { WalletCreateSimpleView } from "./components/pages/onboarding/WalletCreateSimpleView";
import { WalletCreateView } from "./components/pages/wallet/WalletCreateView";
import { WalletView } from "./components/pages/wallet/WalletView";
import { useAnalytics } from "./utils/useAnalytics";

export const Routes: React.FC = () => {
  useAnalytics();
  return (
    <Switch>
      <Route path="/wallets/:walletKey" component={WalletView} />
      <MainLayout>
        <Route path="/onboarding/new" component={WalletCreateSimpleView} />
        <Route path="/wallet/new" component={WalletCreateView} />
        <Route exact path="/" component={IndexView} />
      </MainLayout>
    </Switch>
  );
};
