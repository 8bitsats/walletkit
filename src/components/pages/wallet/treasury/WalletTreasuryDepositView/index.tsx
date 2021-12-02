import { useConnectedWallet } from "@saberhq/use-solana";

import { EmptyStateConnectWallet } from "../../../../common/EmptyState";
import { BasicPage } from "../../../../common/page/BasicPage";
import { WalletTreasuryDepositInner } from "./WalletTreasuryDepositInner";

export const WalletTreasuryDepositView: React.FC = () => {
  const wallet = useConnectedWallet();
  return (
    <BasicPage
      title="Deposit funds"
      description="Deposit tokens into your wallet's treasury."
    >
      {!wallet ? <EmptyStateConnectWallet /> : <WalletTreasuryDepositInner />}
    </BasicPage>
  );
};
