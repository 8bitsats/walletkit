import { Link } from "react-router-dom";

import { EmptyState } from "../../../common/EmptyState";
import { Card } from "../../../common/governance/Card";
import { useGovernor } from "../hooks/useGovernor";
import { ProposalsList } from "./ProposalsList";

export const RecentProposals: React.FC = () => {
  const { path, proposalCount } = useGovernor();
  return (
    <Card
      title="Recent Proposals"
      link={{
        title: "View all proposals",
        href: `${path}/proposals`,
      }}
    >
      {proposalCount === 0 ? (
        <div>
          <EmptyState title="There aren't any proposals yet.">
            <Link
              tw="text-primary hover:text-white transition-colors"
              to={`${path}/proposals/create`}
            >
              Create a proposal
            </Link>
          </EmptyState>
        </div>
      ) : (
        <ProposalsList maxCount={3} />
      )}
    </Card>
  );
};
