import type { ArrowData } from "@arrowprotocol/arrow";
import {
  useToken,
  useUserAssociatedTokenAccounts,
} from "@quarryprotocol/react-quarry";
import { useSail } from "@saberhq/sail";
import { Token } from "@saberhq/token-utils";
import { useMemo, useState } from "react";
import invariant from "tiny-invariant";

import { useParseTokenAmount } from "../../../../hooks/useParseTokenAmount";
import { ActionForm } from "../../ArrowView/PositionManagement/ActionForm";

interface Props {
  arrowData: ArrowData;
}

export const UnstakeForm: React.FC<Props> = ({ arrowData }: Props) => {
  const stakeToken = useToken(arrowData.vendorMiner.mint);
  const arrowTokenRaw = useToken(arrowData.mint);
  const arrowToken = useMemo(
    () =>
      arrowTokenRaw
        ? new Token({
            ...arrowTokenRaw.info,
            name: `${arrowData.beneficiary.toString().slice(0, 4)}'s ${
              stakeToken?.symbol ?? ""
            } Arrow`,
            symbol: `ar${stakeToken?.symbol ?? "TOK"}`,
          })
        : arrowTokenRaw,
    [arrowData.beneficiary, arrowTokenRaw, stakeToken?.symbol]
  );

  const { handleTX } = useSail();

  const [arrowBalance] = useUserAssociatedTokenAccounts([
    arrowToken ?? undefined,
  ]);

  const [arrowAmountStr, setArrowAmountStr] = useState<string>("");
  const arrowAmount = useParseTokenAmount(arrowToken, arrowAmountStr);

  if (!arrowToken) {
    return null;
  }

  const unstakeError =
    arrowAmountStr === ""
      ? "Enter an amount"
      : arrowAmount === null || arrowAmount === undefined
      ? "Invalid token amount"
      : arrowAmount.equalTo("0")
      ? "Enter an amount"
      : !arrowBalance ||
        arrowBalance.balance.equalTo("0") ||
        arrowBalance.balance.lessThan(arrowAmount)
      ? `You don't have enough ${arrowToken.symbol ?? "--"}`
      : null;

  return (
    <ActionForm
      value={arrowAmountStr}
      onChange={setArrowAmountStr}
      errorMessage={unstakeError}
      buttonLabel="Unstake Arrow"
      max={arrowBalance?.balance}
      onSubmit={async (sdk) => {
        invariant(arrowAmount, "vendor amount");
        const tx = await sdk.unstake({
          arrowMint: arrowData.mint,
          amount: arrowAmount,
        });
        await handleTX(tx, "Unstake");
      }}
      onMaxClick={() => {
        setArrowAmountStr(arrowBalance?.balance.toExact() ?? "");
      }}
    />
  );
};
