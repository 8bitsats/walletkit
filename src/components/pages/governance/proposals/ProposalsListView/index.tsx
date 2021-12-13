import { Card } from "../../../../common/governance/Card";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { ProposalsList } from "../../GovernanceOverviewView/ProposalsList";
import { LegendsNeverDie } from "./LegendsNeverDie";

export const ProposalsListView: React.FC = () => {
  return (
    <GovernancePage title="Governance Proposals" right={<LegendsNeverDie />}>
      <Card title="All Proposals">
        <ProposalsList />
      </Card>
    </GovernancePage>
  );
};
