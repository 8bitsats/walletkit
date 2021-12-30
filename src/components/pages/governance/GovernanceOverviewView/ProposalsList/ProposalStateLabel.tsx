import { ProposalState } from "@tribecahq/tribeca-sdk";
import { startCase } from "lodash";
import tw from "twin.macro";

interface Props {
  state: ProposalState;
  executed?: boolean;
}

const STATE_LABELS: { [K in ProposalState]: string } = {
  [ProposalState.Active]: "active",
  [ProposalState.Draft]: "draft",
  [ProposalState.Canceled]: "canceled",
  [ProposalState.Defeated]: "failed",
  [ProposalState.Succeeded]: "passed",
  [ProposalState.Queued]: "queued",
};

export const ProposalStateLabel: React.FC<Props> = ({
  state,
  executed,
}: Props) => {
  return (
    <div
      css={[
        tw`text-xs border rounded py-0.5 w-16 flex items-center justify-center`,
        (state === ProposalState.Canceled ||
          state === ProposalState.Defeated ||
          state === ProposalState.Draft) &&
          tw`border-gray-500 text-gray-500`,
        (executed ||
          state === ProposalState.Succeeded ||
          state === ProposalState.Queued) &&
          tw`border-primary text-primary`,
        state === ProposalState.Active && tw`border-accent text-accent`,
      ]}
    >
      {startCase(executed ? "executed" : STATE_LABELS[state])}
    </div>
  );
};
