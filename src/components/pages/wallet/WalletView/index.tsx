import { usePubkey } from "@saberhq/sail";
import { Route, Switch, useParams } from "react-router-dom";

import { SmartWalletProvider } from "../../../../hooks/useSmartWallet";
import { WalletLayout } from "../../../layout/WalletLayout";
import { WalletTreasuryDepositView } from "../treasury/WalletTreasuryDepositView";
import { WalletTreasurySendView } from "../treasury/WalletTreasurySendView";
import { WalletTreasuryView } from "../treasury/WalletTreasuryView";
import { TransactionView } from "../tx/TransactionView";
import { WalletTXCreateView } from "../txs/WalletTXCreateView";
import { WalletTXListView } from "../txs/WalletTXListView";
import { WalletIndexView } from "../WalletIndexView";
import { WalletProgramsView } from "../WalletProgramsView";
import { WalletSettingsView } from "../WalletSettingsView";

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
            path="/wallets/:walletKey/txs/:listId"
            component={WalletTXListView}
          />
          <Route
            path="/wallets/:walletKey/txs/new"
            component={WalletTXCreateView}
          />
          <Route
            path="/wallets/:walletKey/tx/:transactionSeq"
            component={TransactionView}
          />
          <Route
            path="/wallets/:walletKey/treasury/send/:tokenMint"
            component={WalletTreasurySendView}
          />
          <Route
            path="/wallets/:walletKey/treasury/deposit"
            component={WalletTreasuryDepositView}
          />
          <Route
            path="/wallets/:walletKey/programs"
            component={WalletProgramsView}
          />
          <Route
            path="/wallets/:walletKey/treasury"
            component={WalletTreasuryView}
          />
          <Route
            path="/wallets/:walletKey/settings"
            component={WalletSettingsView}
          />
          <Route path="/wallets/:walletKey" component={WalletIndexView} />
        </Switch>
      </WalletLayout>
    </SmartWalletProvider>
  );
};
