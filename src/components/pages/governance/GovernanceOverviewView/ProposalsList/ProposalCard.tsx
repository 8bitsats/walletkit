import { ProposalState } from "@tribecahq/tribeca-sdk";
import { Link } from "react-router-dom";

import { useGovernor } from "../../hooks/useGovernor";
import type { ProposalInfo } from "../../hooks/useProposals";
import { ActiveProposalVotingBars } from "./ActiveProposalVotingBars";
import { ProposalStateBadge } from "./ProposalStateBadge";
import { ProposalStateDate } from "./ProposalStateDate";
import { ProposalStateLabel } from "./ProposalStateLabel";
import { ReactComponent as PulsingDot } from "./PulsingDot.svg";

interface Props {
  proposalInfo: ProposalInfo;
}

export const ProposalCard: React.FC<Props> = ({ proposalInfo }: Props) => {
  const { path } = useGovernor();
  return (
    <Link
      to={`${path}/proposals/${proposalInfo.index}`}
      tw="flex items-center justify-between py-5 px-6 border-l-2 border-l-transparent border-b border-b-warmGray-800 cursor-pointer hover:border-l-primary"
    >
      <div tw="flex items-center gap-5">
        {proposalInfo.state === ProposalState.Active && (
          <PulsingDot tw="w-11 h-11 text-accent" />
        )}
        <div>
          <div tw="h-5 flex items-center">
            <span tw="text-white leading-snug">
              {proposalInfo.proposalMetaData?.title}
            </span>
          </div>
          {proposalInfo.proposalData && proposalInfo.state !== null && (
            <div tw="flex items-center gap-2 mt-2">
              <ProposalStateLabel state={proposalInfo.state} />
              <div tw="flex gap-1 text-xs font-semibold">
                <span>{`000${proposalInfo.index}`.slice(-4)}</span>
                <span>&middot;</span>
                <ProposalStateDate
                  proposal={proposalInfo.proposalData}
                  state={proposalInfo.state}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {proposalInfo.state === ProposalState.Active && (
        <div tw="w-[290px]">
          <ActiveProposalVotingBars proposal={proposalInfo} />
        </div>
      )}
      {proposalInfo.state !== null &&
        proposalInfo.state !== ProposalState.Draft &&
        proposalInfo.state !== ProposalState.Active && (
          <div tw="md:w-20 lg:w-[140px]">
            <ProposalStateBadge state={proposalInfo.state} />
          </div>
        )}
    </Link>
  );
};
