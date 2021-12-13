import type { ProposalInfo } from "../../hooks/useProposals";
import { ProposalStateDate } from "./ProposalStateDate";
import { ProposalStateLabel } from "./ProposalStateLabel";

interface Props {
  proposalInfo: ProposalInfo;
}

export const ProposalSubtitle: React.FC<Props> = ({ proposalInfo }: Props) => {
  return (
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
  );
};
