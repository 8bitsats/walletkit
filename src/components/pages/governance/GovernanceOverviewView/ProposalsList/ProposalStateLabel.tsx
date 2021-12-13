import { ProposalState } from "@tribecahq/tribeca-sdk";
import { startCase } from "lodash";

interface Props {
  state: ProposalState;
}

const STATE_LABELS: { [K in ProposalState]: string } = {
  [ProposalState.Active]: "active",
  [ProposalState.Draft]: "draft",
  [ProposalState.Canceled]: "canceled",
  [ProposalState.Defeated]: "failed",
  [ProposalState.Succeeded]: "passed",
  [ProposalState.Queued]: "queued",
};

export const ProposalStateLabel: React.FC<Props> = ({ state }: Props) => {
  return (
    <div tw="text-xs border border-primary text-primary rounded py-0.5 w-16 flex items-center justify-center">
      {startCase(STATE_LABELS[state])}
    </div>
  );
};
