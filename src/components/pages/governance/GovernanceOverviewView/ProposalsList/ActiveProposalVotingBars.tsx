import { theme } from "twin.macro";

import { formatNumberSI } from "../../../../../utils/format";
import { LoadingSpinner } from "../../../../common/LoadingSpinner";
import { Meter } from "../../../../common/Meter";
import { useGovernor } from "../../hooks/useGovernor";
import type { ProposalInfo } from "../../hooks/useProposals";

interface Props {
  proposal: ProposalInfo;
}

export const ActiveProposalVotingBars: React.FC<Props> = ({
  proposal,
}: Props) => {
  const { veToken } = useGovernor();
  if (!veToken) {
    return <LoadingSpinner />;
  }
  const forVotes =
    proposal.proposalData.forVotes.toNumber() / 10 ** veToken.decimals;
  const againstVotes =
    proposal.proposalData.againstVotes.toNumber() / 10 ** veToken.decimals;
  const maxVotes = Math.max(forVotes, againstVotes, 1);
  return (
    <div tw="flex flex-col">
      <div tw="w-full flex items-center gap-3 text-xs text-white font-medium h-6">
        <Meter
          value={forVotes}
          max={maxVotes}
          barColor={theme`colors.primary`}
        />
        <div tw="flex-basis[44px]">{formatNumberSI(forVotes)}</div>
      </div>
      <div tw="w-full flex items-center gap-3 text-xs text-white font-medium h-6">
        <Meter
          value={againstVotes}
          max={maxVotes}
          barColor={theme`colors.red.500`}
        />
        <div tw="flex-basis[44px]">{formatNumberSI(againstVotes)}</div>
      </div>
    </div>
  );
};
