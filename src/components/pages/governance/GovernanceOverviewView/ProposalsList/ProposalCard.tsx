import { Link } from "react-router-dom";

import { useGovernor } from "../../hooks/useGovernor";
import type { ProposalInfo } from "../../hooks/useProposals";
import { ProposalStateBadge } from "./ProposalStateBadge";
import { ProposalStateDate } from "./ProposalStateDate";
import { ProposalStateLabel } from "./ProposalStateLabel";

interface Props {
  proposalInfo: ProposalInfo;
}

export const ProposalCard: React.FC<Props> = ({ proposalInfo }: Props) => {
  const { path } = useGovernor();
  return (
    <Link
      to={`${path}/proposals/${proposalInfo.index}`}
      tw="flex items-center justify-between py-4 px-6 border-l-2 border-transparent cursor-pointer hover:border-primary"
    >
      <div>
        <span tw="text-white leading-snug">
          {proposalInfo.proposalMetaData?.title as string}
        </span>
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
      {proposalInfo.state !== null && (
        <ProposalStateBadge state={proposalInfo.state} />
      )}
    </Link>
  );
};
