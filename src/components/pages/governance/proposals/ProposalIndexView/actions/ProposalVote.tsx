import { useSail } from "@saberhq/sail";
import { sleep, TokenAmount } from "@saberhq/token-utils";
import { VoteSide } from "@tribecahq/tribeca-sdk";
import invariant from "tiny-invariant";

import { Button } from "../../../../../common/Button";
import { Card } from "../../../../../common/governance/Card";
import { useUserEscrow } from "../../../hooks/useEscrow";
import { useGovernor } from "../../../hooks/useGovernor";
import type { ProposalInfo } from "../../../hooks/useProposals";
import { VOTE_SIDE_LABEL } from "../VotesCard";

interface Props {
  proposalInfo: ProposalInfo;
  onVote: () => void;
}

export const ProposalVote: React.FC<Props> = ({
  proposalInfo,
  onVote,
}: Props) => {
  const { veToken } = useGovernor();
  const { data: escrow, refetch } = useUserEscrow();
  const vePower =
    veToken && escrow
      ? new TokenAmount(
          veToken,
          escrow.calculateVotingPower(
            proposalInfo.proposalData.votingEndsAt.toNumber()
          )
        )
      : null;
  const { handleTX } = useSail();

  const vote = async (side: VoteSide) => {
    invariant(escrow);
    const tx = await escrow.escrowW.castVote({
      proposal: proposalInfo.proposalKey,
      side,
    });
    const { pending } = await handleTX(tx, `Vote ${VOTE_SIDE_LABEL[side]}`);
    await pending?.wait();
    await sleep(1_000);
    await refetch();
    onVote();
  };

  return (
    <Card title="Vote">
      <div tw="p-4">
        <div tw="flex flex-col items-center mb-4">
          <span tw="text-sm font-medium">Voting Power</span>
          <span tw="text-white font-semibold text-lg">
            {vePower?.formatUnits()}
          </span>
        </div>
        <div tw="flex gap-3">
          <Button
            size="md"
            variant="outline"
            tw="border-primary hover:(border-primary bg-primary bg-opacity-20)"
            onClick={async () => {
              await vote(VoteSide.For);
            }}
          >
            For
          </Button>
          <Button
            size="md"
            variant="outline"
            tw="border-accent hover:(border-accent bg-accent bg-opacity-20)"
            onClick={async () => {
              await vote(VoteSide.Against);
            }}
          >
            Against
          </Button>
          <Button
            size="md"
            variant="outline"
            tw="hover:(border-white bg-white bg-opacity-20)"
            onClick={async () => {
              await vote(VoteSide.Abstain);
            }}
          >
            Abstain
          </Button>
        </div>
      </div>
    </Card>
  );
};
