import { Card } from "../../../common/governance/Card";
import { useGovernor } from "../hooks/useGovernor";
import { ProposalsList } from "./ProposalsList";

export const RecentProposals: React.FC = () => {
  const { path } = useGovernor();
  return (
    <Card
      title="Recent Proposals"
      link={{
        title: "View all proposals",
        href: `${path}/proposals`,
      }}
    >
      <ProposalsList maxCount={3} />
    </Card>
  );
};
