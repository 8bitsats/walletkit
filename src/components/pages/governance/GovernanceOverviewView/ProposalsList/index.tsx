import { ProposalState } from "@tribecahq/tribeca-sdk";
import { useState } from "react";
import { Link } from "react-router-dom";

import { EmptyState } from "../../../../common/EmptyState";
import { useGovernor } from "../../hooks/useGovernor";
import { useProposals } from "../../hooks/useProposals";
import { PageNav } from "./PageNav";
import { PlaceholderCard } from "./PlaceholderCard";
import { ProposalCard } from "./ProposalCard";

const NUM_PLACEHOLDERS = 0;
const PROPOSALS_PER_PAGE = 20;

interface Props {
  maxCount?: number;
  showDrafts?: boolean;
}

export const ProposalsList: React.FC<Props> = ({
  maxCount = 9_999_999,
  showDrafts = false,
}: Props) => {
  const { path, proposalCount } = useGovernor();
  const proposals = useProposals();
  const [currentPage, setCurrentPage] = useState(0);

  const allProposals = [
    ...proposals,
    ...new Array<null>(NUM_PLACEHOLDERS).fill(null),
  ]
    .filter((p) => (showDrafts ? true : p?.data?.state !== ProposalState.Draft))
    .slice(0, maxCount);

  const startCursor = currentPage * PROPOSALS_PER_PAGE;

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

  const pageCount = calcPageTotal(allProposals.length ?? 0);

  return (
    <>
      {allProposals
        .slice(startCursor, startCursor + PROPOSALS_PER_PAGE)
        .map((proposal, i) =>
          proposal && proposal.data ? (
            <ProposalCard
              key={proposal.data.proposalKey.toString()}
              proposalInfo={proposal.data}
            />
          ) : (
            <PlaceholderCard key={i} />
          )
        )}
      {pageCount > 1 && (
        <PageNav
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          numPages={pageCount}
        />
      )}
    </>
  );
};

const calcPageTotal = (numProposals: number): number => {
  const div = Math.floor(numProposals / PROPOSALS_PER_PAGE);
  return div + (numProposals % PROPOSALS_PER_PAGE ? 1 : 0);
};
