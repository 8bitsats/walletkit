import type { ProposalData } from "@tribecahq/tribeca-sdk";
import { ProposalState } from "@tribecahq/tribeca-sdk";
import type BN from "bn.js";

interface Props {
  proposal: ProposalData;
  state: ProposalState;
}

const STATE_LABELS: { [K in ProposalState]: string } = {
  [ProposalState.Active]: "Voting ends",
  [ProposalState.Draft]: "Created",
  [ProposalState.Canceled]: "Canceled",
  [ProposalState.Defeated]: "Failed",
  [ProposalState.Succeeded]: "Passed",
  [ProposalState.Queued]: "Queued",
};

const getDateOfState = (
  proposal: ProposalData,
  state: ProposalState
): BN | null => {
  switch (state) {
    case ProposalState.Active:
      return proposal.votingEndsAt;
    case ProposalState.Canceled:
      return null;
    case ProposalState.Defeated:
    case ProposalState.Succeeded:
      return proposal.votingEndsAt;
    case ProposalState.Draft:
      return proposal.createdAt;
    case ProposalState.Queued:
      return proposal.queuedAt;
  }
};

export const ProposalStateDate: React.FC<Props> = ({
  proposal,
  state,
}: Props) => {
  const dateSeconds = getDateOfState(proposal, state);
  const date = dateSeconds ? new Date(dateSeconds.toNumber() * 1_000) : null;
  return (
    <span>
      {STATE_LABELS[state]}{" "}
      {state === ProposalState.Active
        ? date?.toLocaleString(undefined, {
            timeZoneName: "short",
          })
        : date?.toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
    </span>
  );
};
