import { useState } from "react";
import { Link } from "react-router-dom";

import { EmptyState } from "../../../../common/EmptyState";
import { useGovernor } from "../../hooks/useGovernor";
import { useProposals } from "../../hooks/useProposals";
import { PageNav } from "./PageNav";
import { PlaceholderCard } from "./PlaceholderCard";
import { ProposalCard } from "./ProposalCard";

const NUM_PLACEHOLDERS = 0;
const MAX_PROPOSAL_COUNT = 4;

export const ProposalsList: React.FC = () => {
  const { path, proposalCount } = useGovernor();
  const proposals = useProposals();
  const [currentPage, setCurrentPage] = useState(0);
  const allProposals = [
    ...proposals,
    ...new Array<null>(NUM_PLACEHOLDERS).fill(null),
  ];
  const startCursor = currentPage * MAX_PROPOSAL_COUNT;

  if (proposalCount === 0) {
    return (
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
    );
  }

  return (
    <>
      {allProposals
        .slice(startCursor, startCursor + MAX_PROPOSAL_COUNT)
        .map((proposal, i) =>
          proposal && proposal.data ? (
            <ProposalCard
              key={proposal.data?.proposalKey.toString()}
              proposalInfo={proposal.data}
            />
          ) : (
            <PlaceholderCard key={i} />
          )
        )}
      <PageNav
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        numPages={calcPageTotal(proposals.length ?? 0)}
      />
    </>
  );
};

const calcPageTotal = (numProposals: number): number => {
  const totalProposals = numProposals + NUM_PLACEHOLDERS;
  const div = Math.floor(totalProposals / MAX_PROPOSAL_COUNT);
  return div + (totalProposals % MAX_PROPOSAL_COUNT ? 1 : 0);
};
