import { Link } from "react-router-dom";

import { Button } from "../../../../common/Button";
import { Card } from "../../../../common/governance/Card";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { ProposalsList } from "../../GovernanceOverviewView/ProposalsList";
import { useGovernor, useGovWindowTitle } from "../../hooks/useGovernor";
import { LegendsNeverDie } from "./LegendsNeverDie";

export const ProposalsListView: React.FC = () => {
  const { path } = useGovernor();
  useGovWindowTitle(`Proposals`);

  return (
    <GovernancePage title="Governance Proposals" right={<LegendsNeverDie />}>
      <Card
        title={
          <div tw="flex w-full items-center justify-between">
            <h2>All Proposals</h2>
            <Link to={`${path}/proposals/create`}>
              <Button tw="px-3" variant="primary">
                Create Proposal
              </Button>
            </Link>
          </div>
        }
      >
        <ProposalsList />
      </Card>
    </GovernancePage>
  );
};
