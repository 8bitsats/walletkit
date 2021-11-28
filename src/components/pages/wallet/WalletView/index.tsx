import { usePubkey } from "@saberhq/sail";
import { Route, Switch, useParams } from "react-router-dom";

import { SmartWalletProvider } from "../../../../hooks/useSmartWallet";
import { WalletLayout } from "../../../layout/WalletLayout";
import { TransactionView } from "../TransactionView";
import { WalletIndexView } from "../WalletIndexView";
import { WalletTXCreateView } from "../WalletTXCreateView";
import { WalletTXListView } from "../WalletTXListView";

export const WalletView: React.FC = () => {
  const { walletKey: walletKeyStr } = useParams<{ walletKey: string }>();
  const walletKey = usePubkey(walletKeyStr);
  if (!walletKey) {
    return <div>Invalid wallet key</div>;
  }
  return (
    <SmartWalletProvider initialState={walletKey}>
      <WalletLayout>
        <Switch>
          <Route
            path="/wallets/:walletKey/tx/all"
            component={WalletTXListView}
          />
          <Route
            path="/wallets/:walletKey/tx/new"
            component={WalletTXCreateView}
          />
          <Route
            path="/wallets/:walletKey/tx/:transactionSeq"
            component={TransactionView}
          />
          <Route path="/wallets/:walletKey" component={WalletIndexView} />
        </Switch>
      </WalletLayout>
    </SmartWalletProvider>
  );
};
