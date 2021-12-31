import React, { useEffect } from "react";
import { Route, Switch, useLocation } from "react-router-dom";

import { TransactionBuilder } from "./components/common/TransactionBuilder";
import { MainLayout } from "./components/layout/MainLayout";
import { GovernanceView } from "./components/pages/governance/GovernanceView";
import { IndexView } from "./components/pages/landing";
import { DAOCustomView } from "./components/pages/onboarding/dao/DAOCustomView";
import { DAOStep1IntroView } from "./components/pages/onboarding/dao/DAOStep1IntroView";
import { DAOStep2ExecutiveView } from "./components/pages/onboarding/dao/DAOStep2ExecutiveView";
import { DAOStep3EmergencyView } from "./components/pages/onboarding/dao/DAOStep3EmergencyView";
import { DAOStep4LockerView } from "./components/pages/onboarding/dao/DAOStep4LockerView";
import { WalletCreateView } from "./components/pages/onboarding/WalletCreateAdvancedView";
import { WalletCreateSimpleView } from "./components/pages/onboarding/WalletCreateSimpleView";
import { UserView } from "./components/pages/UserView";
import { WalletView } from "./components/pages/wallet/WalletView";
import { useAnalytics } from "./utils/useAnalytics";

export const Routes: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    if (
      process.env.REACT_APP_APP_CONFIG === "tribeca" ||
      location.pathname.startsWith("/gov") ||
      location.pathname.startsWith("/onboarding/dao")
    ) {
      document.body.classList.add("dark");
      return () => {
        document.body.classList.remove("dark");
      };
    }
  }, [location.pathname]);

  useAnalytics();
  return (
    <Switch>
      <Route path="/tools/tx-builder" component={TransactionBuilder} />
      <Route path="/wallets/:walletKey" component={WalletView} />
      <Route path="/gov/:governor" component={GovernanceView} />
      <MainLayout>
        <Switch>
          <Route path="/onboarding/dao/custom" component={DAOCustomView} />
          <Route
            path="/onboarding/dao/create-executive"
            component={DAOStep2ExecutiveView}
          />
          <Route
            path="/onboarding/dao/create-emergency"
            component={DAOStep3EmergencyView}
          />
          <Route
            path="/onboarding/dao/create-dao"
            component={DAOStep4LockerView}
          />
          <Route path="/onboarding/dao" component={DAOStep1IntroView} />
        </Switch>
        <Route path="/onboarding/new" component={WalletCreateSimpleView} />
        <Route path="/onboarding/advanced" component={WalletCreateView} />
        <Route path="/user" component={UserView} />
        <Route exact path="/" component={IndexView} />
      </MainLayout>
    </Switch>
  );
};
