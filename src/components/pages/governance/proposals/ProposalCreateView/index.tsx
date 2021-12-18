import tw from "twin.macro";

import { useSDK } from "../../../../../contexts/sdk";
import { EmptyStateConnectWallet } from "../../../../common/EmptyState";
import { Card } from "../../../../common/governance/Card";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { ProposalCreateInner } from "./ProposalCreateInner";

export const ProposalCreateView: React.FC = () => {
  const { sdkMut } = useSDK();
  return (
    <GovernancePage
      title="Create a Proposal"
      containerStyles={tw`w-11/12 max-w-xl mx-auto`}
    >
      <Card title="Proposal Info">
        {sdkMut ? <ProposalCreateInner /> : <EmptyStateConnectWallet />}
      </Card>
    </GovernancePage>
  );
};
