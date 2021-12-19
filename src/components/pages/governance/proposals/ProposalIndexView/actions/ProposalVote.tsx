import { TokenAmount } from "@saberhq/token-utils";
import type { VoteSide } from "@tribecahq/tribeca-sdk";
import { VOTE_SIDE_LABELS } from "@tribecahq/tribeca-sdk";

import { useSDK } from "../../../../../../contexts/sdk";
import { Card } from "../../../../../common/governance/Card";
import { useUserEscrow } from "../../../hooks/useEscrow";
import { useGovernor } from "../../../hooks/useGovernor";
import type { ProposalInfo } from "../../../hooks/useProposals";
import { useVote } from "../../../hooks/useVote";
import { sideColor } from "../../../utils/voting";
import { CastVoteButton } from "../CastVoteButton";

interface Props {
  proposalInfo: ProposalInfo;
  onVote: () => void;
}

export const ProposalVote: React.FC<Props> = ({ proposalInfo }: Props) => {
  const { veToken } = useGovernor();
  const { sdkMut } = useSDK();
  const { data: escrow } = useUserEscrow();
  const { data: vote } = useVote(
    proposalInfo.proposalKey,
    sdkMut?.provider.wallet.publicKey
  );
  const vePower =
    veToken && escrow
      ? new TokenAmount(
          veToken,
          escrow.calculateVotingPower(
            proposalInfo.proposalData.votingEndsAt.toNumber()
          )
        )
      : null;

  return (
    <Card title="Vote">
      <div tw="py-8">
        <div tw="flex flex-col items-center gap-4">
          <div tw="flex flex-col items-center gap-1">
            <span tw="text-sm font-medium">Voting Power</span>
            <span tw="text-white font-semibold text-lg">
              {vePower?.formatUnits()}
            </span>
          </div>
          {vote && (
            <div tw="flex flex-col items-center gap-1">
              <span tw="text-sm font-medium">You Voted</span>
              <span
                tw="text-white font-semibold text-lg"
                style={
                  vote
                    ? {
                        color: sideColor(vote.accountInfo.data.side),
                      }
                    : {}
                }
              >
                {VOTE_SIDE_LABELS[vote.accountInfo.data.side as VoteSide]}
              </span>
            </div>
          )}
          <div>
            <CastVoteButton
              proposalInfo={proposalInfo}
              side={vote ? vote.accountInfo.data.side : null}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
