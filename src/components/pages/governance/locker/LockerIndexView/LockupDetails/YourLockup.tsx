import { Card } from "../../../../../common/governance/Card";
import { TokenAmountDisplay } from "../../../../../common/TokenAmountDisplay";
import { useUserEscrow } from "../../../hooks/useEscrow";
import { CardItem } from "../CardItem";
import { formatDurationSeconds } from "../LockEscrowModal";

interface Props {
  className?: string;
}

export const YourLockup: React.FC<Props> = ({ className }: Props) => {
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
      <div tw="flex flex-row">
        {veBalance && (
          <CardItem label={`${veBalance.token.symbol} Balance`}>
            <TokenAmountDisplay amount={veBalance} showSymbol={false} />
          </CardItem>
        )}
        <CardItem label="Time Remaining">{timeRemaining}</CardItem>
        <CardItem label="End Date">{endDate.toLocaleDateString()}</CardItem>
      </div>
    </Card>
  );
};
