import { ConnectWalletButton } from "@gokiprotocol/walletkit";
import { FaVoteYea } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useSDK } from "../../../../../../contexts/sdk";
import { Button } from "../../../../../common/Button";
import { EmptyState } from "../../../../../common/EmptyState";
import { Card } from "../../../../../common/governance/Card";
import { useGovernor } from "../../../hooks/useGovernor";
import { formatDurationSeconds } from "../LockEscrowModal";

interface Props {
  className?: string;
}

export const SetupVoting: React.FC<Props> = ({ className }: Props) => {
  const { govToken, veToken, daoName, lockerData, governor } = useGovernor();
  const { sdkMut } = useSDK();

  const maxStakeFmt = lockerData
    ? formatDurationSeconds(
        lockerData.accountInfo.data.params.maxStakeDuration.toNumber()
      )
    : "--";

  return (
    <Card title="Setup Voting" className={className}>
      {!sdkMut && (
        <EmptyState
          icon={<FaVoteYea />}
          title="Connect your wallet to participate in governance."
        >
          <div tw="mt-8">
            <ConnectWalletButton />
          </div>
        </EmptyState>
      )}
      {sdkMut && (
        <div tw="px-7 py-4 text-sm grid gap-4">
          <p>
            Participating in {daoName} Governance requires that an account have
            a balance of vote-escrowed {govToken?.symbol} ({veToken?.symbol}).
            participate in governance, you must lock up {govToken?.name} for a
            period of time.
          </p>
          <p>
            {veToken?.symbol} cannot be transferred. The only way to obtain{" "}
            {veToken?.symbol} is by locking {govToken?.symbol}. The maximum lock
            time is {maxStakeFmt}. One {govToken?.symbol} locked for{" "}
            {maxStakeFmt} provides an initial balance of{" "}
            {lockerData?.accountInfo.data.params.maxStakeVoteMultiplier.toString()}{" "}
            {veToken?.symbol}.
          </p>
          <div>
            <Link to={`/gov/${governor.toString()}/locker/lock`}>
              <Button size="md" variant="primary">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
};
