import { Card } from "../../../../../common/governance/Card";
import { LoadingSpinner } from "../../../../../common/LoadingSpinner";
import { TokenAmountDisplay } from "../../../../../common/TokenAmountDisplay";
import { useUserEscrow } from "../../../hooks/useEscrow";
import { useGovernor } from "../../../hooks/useGovernor";
import { CardItem } from "../CardItem";
import { formatDurationSeconds } from "../LockEscrowModal";

interface Props {
  className?: string;
}

export const YourLockup: React.FC<Props> = ({ className }: Props) => {
  const { veToken } = useGovernor();
  const { data: escrow, veBalance } = useUserEscrow();

  if (!escrow) {
    return <></>;
  }

  const endDate = new Date(escrow.escrow.escrowEndsAt.toNumber() * 1_000);
  const timeRemaining = escrow
    ? formatDurationSeconds(
        escrow.escrow.escrowEndsAt.sub(escrow.escrow.escrowStartedAt).toNumber()
      )
    : null;
  return (
    <Card title="Your Lockup" className={className}>
      <div tw="flex flex-row flex-wrap">
        <CardItem label={`${veToken?.symbol ?? "ve"} Balance`}>
          {veBalance ? (
            <TokenAmountDisplay amount={veBalance} showSymbol={false} />
          ) : (
            <LoadingSpinner />
          )}
        </CardItem>
        <CardItem label="Time Remaining">{timeRemaining}</CardItem>
        <CardItem label="End Date">{endDate.toLocaleDateString()}</CardItem>
      </div>
    </Card>
  );
};
