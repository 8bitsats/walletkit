import { useProposals } from "../../hooks/useProposals";
import { ProposalCard } from "./ProposalCard";

export const ProposalsList: React.FC = () => {
  const proposals = useProposals();
  return (
    <>
      {proposals.map((proposal) =>
        proposal.data ? (
          <ProposalCard
            key={proposal.data?.proposalKey.toString()}
            proposalInfo={proposal.data}
          />
        ) : null
      )}
    </>
  );
};
