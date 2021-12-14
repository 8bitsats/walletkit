import { useState } from "react";

import { useProposals } from "../../hooks/useProposals";
import { PageNav } from "./PageNav";
import { PlaceholderCard } from "./PlaceholderCard";
import { ProposalCard } from "./ProposalCard";

const NUM_PLACER_HOLDERS = 10;
const MAX_PROPOSAL_COUNT = 4;

export const ProposalsList: React.FC = () => {
  const proposals = useProposals();
  const [currentPage, setCurrentPage] = useState(0);
  const allProposals = [
    ...proposals,
    ...new Array<null>(NUM_PLACER_HOLDERS).fill(null),
  ];
  const startCursor = currentPage * MAX_PROPOSAL_COUNT;
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
  const totalProposals = numProposals + NUM_PLACER_HOLDERS;
  const div = Math.floor(totalProposals / MAX_PROPOSAL_COUNT);
  return div + (totalProposals % MAX_PROPOSAL_COUNT ? 1 : 0);
};
