import {
  useToken,
  useUserAssociatedTokenAccounts,
} from "@quarryprotocol/react-quarry";
import { Link, useHistory, useParams } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { useSDK } from "../../../../../contexts/sdk";
import { Button } from "../../../../common/Button";
import { Card } from "../../../../common/governance/Card";
import { TokenAmountDisplay } from "../../../../common/TokenAmountDisplay";
import { TokenIcon } from "../../../../common/TokenIcon";
import { useLocker, useUserEscrow } from "../../hooks/useEscrow";
import { useGovernor } from "../../hooks/useGovernor";
import { CardItem } from "./CardItem";
import { LockEscrowModal } from "./LockEscrowModal";

interface Props {
  className?: string;
}

export const EscrowInfo: React.FC<Props> = ({ className }: Props) => {
  const { lockerSubpage } = useParams<{ lockerSubpage: string }>();
  const { governor, path } = useGovernor();
  const { data: locker } = useLocker();
  const govToken = useToken(locker?.accountInfo.data.tokenMint);
  const [govTokenBalance] = useUserAssociatedTokenAccounts([govToken]);
  const { data: escrow, isLoading } = useUserEscrow();
  const { sdkMut } = useSDK();

  const history = useHistory();
  const lockModalVariant =
    lockerSubpage === "lock" || lockerSubpage === "extend"
      ? lockerSubpage
      : null;
  const showModal = !!lockModalVariant;

  return (
    <Card className={className} title="Voting Wallet">
      <LockEscrowModal
        variant={lockModalVariant}
        escrowW={escrow ? escrow.escrowW : null}
        isOpen={showModal}
        onDismiss={() => history.push(`/gov/${governor.toString()}/locker`)}
      />
      <CardItem label={`${govToken?.symbol ?? "Token"} Balance`}>
        <div tw="flex items-center gap-2.5 h-7">
          {govTokenBalance ? (
            <TokenAmountDisplay
              amount={govTokenBalance.balance}
              showSymbol={false}
            />
          ) : (
            <div tw="h-4 w-12 animate-pulse rounded bg-white bg-opacity-10" />
          )}
          <TokenIcon size={18} token={govToken} />
        </div>
      </CardItem>
      <div tw="px-7 py-4 flex gap-4">
        {!escrow && isLoading ? (
          <>
            <ButtonLoader />
            <ButtonLoader />
          </>
        ) : !sdkMut ? (
          <ButtonLoader />
        ) : (
          <>
            <Link to={`${path}/locker/lock`} tw="flex-grow">
              <Button
                tw="w-full border-primary dark:text-primary hover:dark:text-white"
                type="button"
                size="md"
                variant="outline"
              >
                Lock
              </Button>
            </Link>
            {escrow && (
              <Link to={`${path}/locker/extend`} tw="flex-grow">
                <Button
                  tw="w-full border-primary dark:text-primary hover:dark:text-white"
                  type="button"
                  size="md"
                  variant="outline"
                >
                  Extend
                </Button>
              </Link>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

const ButtonLoader = styled.div`
  ${tw`w-full bg-white bg-opacity-10 rounded animate-pulse h-[50px]`}
`;
