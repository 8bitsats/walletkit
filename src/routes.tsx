import React from "react";
import { Route, Switch } from "react-router-dom";

import { MainLayout } from "./components/layout/MainLayout";
import { IndexView } from "./components/pages/IndexView";
import { WalletCreateView } from "./components/pages/onboarding/WalletCreateAdvancedView";
import { WalletCreateSimpleView } from "./components/pages/onboarding/WalletCreateSimpleView";
import { UserView } from "./components/pages/UserView";
import { WalletView } from "./components/pages/wallet/WalletView";
import { useAnalytics } from "./utils/useAnalytics";

export const Routes: React.FC = () => {
  useAnalytics();
  return (
    <Switch>
      <Route path="/wallets/:walletKey" component={WalletView} />
      <MainLayout>
        <Route path="/onboarding/new" component={WalletCreateSimpleView} />
        <Route path="/onboarding/advanced" component={WalletCreateView} />
        <Route path="/user" component={UserView} />
        <Route exact path="/" component={IndexView} />
      </MainLayout>
    </Switch>
  );
};
