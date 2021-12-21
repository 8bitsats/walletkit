import { useSail } from "@saberhq/sail";
import { formatDistance } from "date-fns";

import { Button } from "../../../../../common/Button";
import { Card } from "../../../../../common/governance/Card";
import { LoadingSpinner } from "../../../../../common/LoadingSpinner";
import { TokenAmountDisplay } from "../../../../../common/TokenAmountDisplay";
import { useUserEscrow } from "../../../hooks/useEscrow";
import { useGovernor } from "../../../hooks/useGovernor";
import { makeDate } from "../../../proposals/ProposalIndexView/ProposalHistory";
import { CardItem } from "../CardItem";

interface Props {
  className?: string;
}

export const YourLockup: React.FC<Props> = ({ className }: Props) => {
  const { veToken } = useGovernor();
  const { data: escrow, veBalance } = useUserEscrow();
  const { handleTX } = useSail();

  if (!escrow) {
    return <></>;
  }

  const endDate = makeDate(escrow.escrow.escrowEndsAt);

  if (endDate <= new Date()) {
    return (
      <Card title="Your Lockup" className={className}>
        <div tw="px-7 py-4 text-sm grid gap-4">
          <p>
            Your lockup has expired. You may now withdraw your locked tokens.
          </p>
          <div>
            <Button
              size="md"
              variant="primary"
              onClick={async () => {
                const exitTX = await escrow.escrowW.exit();
                const { pending, success } = await handleTX(
                  exitTX,
                  "Exit Vote Escrow"
                );
                if (!success || !pending) {
                  return;
                }
                await pending.wait();
              }}
            >
              Withdraw Tokens
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const timeRemaining = formatDistance(endDate, new Date());

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
