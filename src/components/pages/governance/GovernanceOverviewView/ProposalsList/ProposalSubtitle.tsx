import type { ProposalInfo } from "../../hooks/useProposals";
import { ProposalStateDate } from "./ProposalStateDate";
import { ProposalStateLabel } from "./ProposalStateLabel";

interface Props {
  className?: string;
  proposalInfo: ProposalInfo;
}

export const ProposalSubtitle: React.FC<Props> = ({
  proposalInfo,
  className,
}: Props) => {
  const { state, executed } = proposalInfo.status;
  return (
    <div tw="flex items-center gap-2 mt-2" className={className}>
      <ProposalStateLabel state={state} executed={executed} />
      <div tw="flex gap-1 text-xs font-semibold">
        <span>{`000${proposalInfo.index}`.slice(-4)}</span>
        <span>&middot;</span>
        <ProposalStateDate proposalInfo={proposalInfo} />
      </div>
    </div>
  );
};
