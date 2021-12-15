import type { ProposalData } from "@tribecahq/tribeca-sdk";
import { VoteSide } from "@tribecahq/tribeca-sdk";
import tw, { theme } from "twin.macro";

import { Card } from "../../../../common/governance/Card";
import { LoadingSpinner } from "../../../../common/LoadingSpinner";
import { Meter } from "../../../../common/Meter";
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
      : 0;
  const voteCountFmt =
    veToken && voteCount !== null ? (
      (voteCount / 10 ** veToken.decimals).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })
    ) : (
      <LoadingSpinner />
    );

  const totalDeterminingVotes = proposal.forVotes
    .add(proposal.againstVotes)
    .toNumber();

  return (
    <Card
      title={
        <div tw="flex flex-col gap-3.5 w-full">
          <div tw="flex items-center justify-between">
            <div>{VOTE_SIDE_LABEL[side]}</div>
            <div>{voteCountFmt}</div>
          </div>
          <Meter
            value={voteCount}
            max={Math.max(totalDeterminingVotes, 1)}
            barColor={
              side === VoteSide.For
                ? theme`colors.primary`
                : theme`colors.red.500`
            }
          />
        </div>
      }
      titleStyles={tw`h-20`}
      link={{
        title: "View All",
        href: "",
      }}
    ></Card>
  );
};
