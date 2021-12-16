import { GovernancePage } from "../../../common/governance/GovernancePage";
import { useGovWindowTitle } from "../hooks/useGovernor";
import { OverviewHeader } from "./OverviewHeader";
import { RecentProposals } from "./RecentProposals";

export const GovernanceOverviewView: React.FC = () => {
  useGovWindowTitle(`Overview`);
  return (
    <GovernancePage title="Governance Details" preContent={<OverviewHeader />}>
      <RecentProposals />
    </GovernancePage>
  );
};
