import type { ProposalData } from "@tribecahq/tribeca-sdk";
import { VoteSide } from "@tribecahq/tribeca-sdk";

import { Card } from "../../../../common/governance/Card";
import { LoadingSpinner } from "../../../../common/LoadingSpinner";
import { useGovernor } from "../../hooks/useGovernor";

export const VOTE_SIDE_LABEL = {
  [VoteSide.For]: "For",
  [VoteSide.Against]: "Against",
  [VoteSide.Abstain]: "Abstain",
  [VoteSide.Pending]: "Pending",
} as const;

interface Props {
  side: VoteSide.For | VoteSide.Against;
  proposal: ProposalData;
}

export const VotesCard: React.FC<Props> = ({ side, proposal }: Props) => {
  const { veToken } = useGovernor();
  const voteCount =
    side === VoteSide.For
      ? proposal.forVotes.toNumber()
      : side === VoteSide.Against
      ? proposal.againstVotes.toNumber()
      : null;
  const voteCountFmt =
    veToken && voteCount !== null ? (
      (voteCount / 10 ** veToken.decimals).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })
    ) : (
      <LoadingSpinner />
    );
  return (
    <Card
      title={
        <div tw="flex items-center justify-between w-full">
          <div>{VOTE_SIDE_LABEL[side]}</div>
          <div>{voteCountFmt}</div>
        </div>
      }
      link={{
        title: "View All",
        href: "",
      }}
    ></Card>
  );
};
