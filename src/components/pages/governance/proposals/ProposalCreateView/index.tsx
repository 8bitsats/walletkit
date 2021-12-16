import { useSDK } from "../../../../../contexts/sdk";
import { EmptyStateConnectWallet } from "../../../../common/EmptyState";
import { Card } from "../../../../common/governance/Card";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { ProposalCreateInner } from "./ProposalCreateInner";

export const ProposalCreateView: React.FC = () => {
  const { sdkMut } = useSDK();
  return (
    <GovernancePage title="Create a Proposal">
      <Card title="Proposal Info" tw="max-w-xl mx-auto">
        {sdkMut ? <ProposalCreateInner /> : <EmptyStateConnectWallet />}
      </Card>
    </GovernancePage>
  );
};
