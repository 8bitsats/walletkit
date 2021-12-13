import { GovernancePage } from "../../../common/governance/GovernancePage";
import { OverviewHeader } from "./OverviewHeader";
import { RecentProposals } from "./RecentProposals";

export const GovernanceOverviewView: React.FC = () => {
  return (
    <GovernancePage title="Governance Details" preContent={<OverviewHeader />}>
      <RecentProposals />
    </GovernancePage>
  );
};
