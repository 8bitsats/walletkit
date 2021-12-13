import { ProposalState, VoteSide } from "@tribecahq/tribeca-sdk";
import { useParams } from "react-router-dom";

import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { Profile } from "../../../../common/governance/Profile";
import { ProposalSubtitle } from "../../GovernanceOverviewView/ProposalsList/ProposalSubtitle";
import { useProposal } from "../../hooks/useProposals";
import { ProposalActivate } from "./actions/ProposalActivate";
import { ProposalQueue } from "./actions/ProposalQueue";
import { ProposalVote } from "./actions/ProposalVote";
import { ProposalDetails } from "./ProposalDetails";
import { ProposalHistory } from "./ProposalHistory";
import { VotesCard } from "./VotesCard";

export const ProposalIndexView: React.FC = () => {
  const { proposalIndex: proposalIndexStr } = useParams<{
    proposalIndex: string;
  }>();
  const proposal = useProposal(parseInt(proposalIndexStr));
  return (
    <GovernancePage
      title={proposal.data?.proposalMetaData?.title ?? "Proposal"}
      header={
        <div>
          {proposal.data && <ProposalSubtitle proposalInfo={proposal.data} />}
        </div>
      }
      right={
        proposal.data ? (
          <Profile address={proposal.data.proposalData.proposer} />
        ) : undefined
      }
    >
      <div tw="grid gap-4 mb-20">
        {proposal.data && (
          <div tw="grid grid-cols-2 gap-4">
            <VotesCard
              side={VoteSide.For}
              proposal={proposal.data.proposalData}
            />
            <VotesCard
              side={VoteSide.Against}
              proposal={proposal.data.proposalData}
            />
          </div>
        )}
        <div tw="flex gap-4 items-start">
          <ProposalDetails tw="flex-grow[2]" proposalInfo={proposal.data} />
          <div tw="flex-basis[350px] flex flex-col gap-4">
            {proposal.data?.state === ProposalState.Draft && (
              <ProposalActivate
                proposal={proposal.data}
                onActivate={() => {
                  void proposal.refetch();
                }}
              />
            )}
            {proposal.data?.state === ProposalState.Active && (
              <ProposalVote
                proposalInfo={proposal.data}
                onVote={() => {
                  void proposal.refetch();
                }}
              />
            )}
            {proposal.data?.state === ProposalState.Succeeded && (
              <ProposalQueue
                proposal={proposal.data}
                onActivate={() => {
                  void proposal.refetch();
                }}
              />
            )}
            <ProposalHistory proposalInfo={proposal.data} />
          </div>
        </div>
      </div>
    </GovernancePage>
  );
};
