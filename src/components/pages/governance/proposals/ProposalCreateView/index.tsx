import { useSDK } from "../../../../../contexts/sdk";
import { EmptyStateConnectWallet } from "../../../../common/EmptyState";
import { Card } from "../../../../common/governance/Card";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { ProposalCreateInner } from "./ProposalCreateInner";

export const ProposalCreateView: React.FC = () => {
  const { sdkMut } = useSDK();
  return (
    <GovernancePage title="Create a Proposal">
      {sdkMut ? (
        <ProposalCreateInner />
      ) : (
        <Card title="Proposal Info">
          <EmptyStateConnectWallet />
        </Card>
      )}
    </GovernancePage>
  );
};
