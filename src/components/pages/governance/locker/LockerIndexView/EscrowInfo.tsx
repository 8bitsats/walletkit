import {
  useToken,
  useUserAssociatedTokenAccounts,
} from "@quarryprotocol/react-quarry";
import { useConnectedWallet } from "@saberhq/use-solana";
import { useHistory, useParams } from "react-router-dom";

import { Button } from "../../../../common/Button";
import { Card } from "../../../../common/governance/Card";
import { LoadingSpinner } from "../../../../common/LoadingSpinner";
import { TokenAmountDisplay } from "../../../../common/TokenAmountDisplay";
import { TokenIcon } from "../../../../common/TokenIcon";
import { useEscrow, useLocker } from "../../hooks/useEscrow";
import { useGovernor } from "../../hooks/useGovernor";
import { CardItem } from "./CardItem";
import { LockEscrowModal } from "./LockEscrowModal";

interface Props {
  className?: string;
}

export const EscrowInfo: React.FC<Props> = ({ className }: Props) => {
  const { lockerSubpage } = useParams<{ lockerSubpage: string }>();
  const wallet = useConnectedWallet();
  const { governor } = useGovernor();
  const { data: locker } = useLocker();
  const govToken = useToken(locker?.accountInfo.data.tokenMint);
  const [govTokenBalance] = useUserAssociatedTokenAccounts([govToken]);
  const { data: escrow } = useEscrow(wallet?.publicKey);

  const history = useHistory();
  const showModal = lockerSubpage === "lock";

  return (
    <Card className={className} title="Voting Wallet">
      <LockEscrowModal
        escrowW={escrow ? escrow.escrowW : null}
        isOpen={showModal}
        onDismiss={() => history.push(`/gov/${governor.toString()}/locker`)}
      />
      <CardItem label={`${govToken?.symbol ?? "Token"} Balance`}>
        <div tw="flex items-center gap-2.5">
          {govTokenBalance ? (
            <TokenAmountDisplay
              amount={govTokenBalance.balance}
              showSymbol={false}
            />
          ) : (
            <LoadingSpinner />
          )}
          <TokenIcon size={18} token={govToken} />
        </div>
      </CardItem>
      <div tw="px-7 py-4">
        <Button
          tw="w-full border-primary dark:text-primary hover:dark:text-white"
          type="button"
          size="md"
          variant="outline"
          onClick={() => {
            history.push(`/gov/${governor.toString()}/locker/lock`);
          }}
        >
          Lock
        </Button>
      </div>
    </Card>
  );
};
