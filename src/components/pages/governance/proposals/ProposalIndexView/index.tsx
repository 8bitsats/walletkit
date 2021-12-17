import { ProposalState, VoteSide } from "@tribecahq/tribeca-sdk";
import { noop } from "lodash";
import { useParams } from "react-router-dom";

import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { Profile } from "../../../../common/governance/Profile";
import { ProposalSubtitle } from "../../GovernanceOverviewView/ProposalsList/ProposalSubtitle";
import { useGovWindowTitle } from "../../hooks/useGovernor";
import { useProposal } from "../../hooks/useProposals";
import { ProposalActivate } from "./actions/ProposalActivate";
import { ProposalExecute } from "./actions/ProposalExecute";
import { ProposalQueue } from "./actions/ProposalQueue";
import { ProposalVote } from "./actions/ProposalVote";
import { ProposalDetails } from "./ProposalDetails";
import { ProposalHistory } from "./ProposalHistory";
import { VotesCard } from "./VotesCard";

export const ProposalIndexView: React.FC = () => {
  const { proposalIndex: proposalIndexStr } = useParams<{
    proposalIndex: string;
  }>();
  const { index, info: proposalInfo } = useProposal(parseInt(proposalIndexStr));
  useGovWindowTitle(`Proposal Detail #${index}`);

  return (
    <GovernancePage
      title={proposalInfo?.proposalMetaData?.title ?? "Proposal"}
      header={
        <div tw="flex items-center gap-2 mt-2">
          {proposalInfo && <ProposalSubtitle proposalInfo={proposalInfo} />}
        </div>
      }
      right={
        proposalInfo ? (
          <Profile address={proposalInfo.proposalData.proposer} />
        ) : undefined
      }
    >
      <div tw="grid gap-4 mb-20">
        {proposalInfo && (
          <div tw="grid md:grid-cols-2 gap-4">
            <VotesCard
              side={VoteSide.For}
              proposal={proposalInfo.proposalData}
            />
            <VotesCard
              side={VoteSide.Against}
              proposal={proposalInfo.proposalData}
            />
          </div>
        )}
        <div tw="flex flex-col md:(flex-row items-start) gap-4">
          <ProposalDetails tw="flex-grow[2]" proposalInfo={proposalInfo} />
          <div tw="flex-basis[350px] flex flex-col gap-4">
            {proposalInfo?.state === ProposalState.Draft && (
              <ProposalActivate proposal={proposalInfo} onActivate={noop} />
            )}
            {proposalInfo?.state === ProposalState.Active && (
              <ProposalVote proposalInfo={proposalInfo} onVote={noop} />
            )}
            {proposalInfo?.state === ProposalState.Succeeded && (
              <ProposalQueue proposal={proposalInfo} onActivate={noop} />
            )}
            {proposalInfo?.state === ProposalState.Queued && (
              <ProposalExecute proposal={proposalInfo} onActivate={noop} />
            )}
            <ProposalHistory proposalInfo={proposalInfo} />
          </div>
        </div>
      </div>
    </GovernancePage>
  );
};
