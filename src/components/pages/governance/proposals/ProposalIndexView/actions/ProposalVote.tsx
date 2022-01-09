import { ConnectWalletButton } from "@gokiprotocol/walletkit";
import { TokenAmount } from "@saberhq/token-utils";
import type { VoteSide } from "@tribecahq/tribeca-sdk";
import { VOTE_SIDE_LABELS } from "@tribecahq/tribeca-sdk";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useSDK } from "../../../../../../contexts/sdk";
import { Button } from "../../../../../common/Button";
import { Card } from "../../../../../common/governance/Card";
import { MouseoverTooltip } from "../../../../../common/MouseoverTooltip";
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
  const { veToken, path } = useGovernor();
  const { sdkMut } = useSDK();
  const { data: escrow, veBalance } = useUserEscrow();
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

  const lockupTooShort =
    escrow &&
    escrow.escrow.escrowEndsAt.lt(proposalInfo.proposalData.votingEndsAt);

  return (
    <Card
      title={
        <div tw="flex">
          <span>Vote</span>
          {lockupTooShort && (
            <MouseoverTooltip
              text={
                <div tw="max-w-sm">
                  <p>
                    Your voting escrow expires before the period which voting
                    ends. Please extend your lockup to cast your vote.
                  </p>
                </div>
              }
              placement="bottom-start"
            >
              <FaExclamationTriangle
                tw="h-4 cursor-pointer inline-block align-middle mx-2 mb-0.5"
                color="#9945FF"
              />
            </MouseoverTooltip>
          )}
        </div>
      }
    >
      <div tw="py-8">
        <div tw="flex flex-col items-center gap-4">
          {!sdkMut ? (
            <ConnectWalletButton />
          ) : !veBalance ? (
            <div tw="text-sm px-8 text-center">
              <p>You must lock tokens in order to vote on this proposal.</p>
              <Link tw="flex justify-center items-center" to={`${path}/locker`}>
                <Button
                  variant="outline"
                  tw="border-white hover:(border-primary bg-primary bg-opacity-20) mt-4"
                >
                  Lock Tokens
                </Button>
              </Link>
            </div>
          ) : (
            <>
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
              <div tw="flex w-full items-center justify-center">
                <CastVoteButton
                  proposalInfo={proposalInfo}
                  side={vote ? vote.accountInfo.data.side : null}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
