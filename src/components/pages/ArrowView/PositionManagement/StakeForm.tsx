import type { ArrowData } from "@arrowprotocol/arrow";
import {
  useToken,
  useUserAssociatedTokenAccounts,
} from "@quarryprotocol/react-quarry";
import { useSail } from "@saberhq/sail";
import { useState } from "react";
import invariant from "tiny-invariant";

import { useParseTokenAmount } from "../../../../hooks/useParseTokenAmount";
import { ActionForm } from "../../ArrowView/PositionManagement/ActionForm";

interface Props {
  arrowData: ArrowData;
}

export const StakeForm: React.FC<Props> = ({ arrowData }: Props) => {
  const vendorToken = useToken(arrowData.vendorMiner.mint);
  const { handleTX } = useSail();

  const [vendorBalance] = useUserAssociatedTokenAccounts([
    vendorToken ?? undefined,
  ]);

  const [vendorAmountStr, setVendorAmountStr] = useState<string>("");
  const vendorAmount = useParseTokenAmount(vendorToken, vendorAmountStr);

  if (!vendorToken) {
    return null;
  }

  const stakeError =
    vendorAmountStr === ""
      ? "Enter an amount"
      : vendorAmount === null || vendorAmount === undefined
      ? "Invalid token amount"
      : vendorAmount.equalTo("0")
      ? "Enter an amount"
      : !vendorBalance ||
        vendorBalance.balance.equalTo("0") ||
        vendorBalance.balance.lessThan(vendorAmount)
      ? `You don't have enough ${vendorToken.symbol ?? "--"}`
      : null;

  return (
    <ActionForm
      value={vendorAmountStr}
      onChange={setVendorAmountStr}
      errorMessage={stakeError}
      buttonLabel="Stake into Arrow"
      max={vendorBalance?.balance}
      onSubmit={async (sdk) => {
        invariant(vendorAmount, "vendor amount");
        const tx = await sdk.stake({
          arrowMint: arrowData.mint,
          amount: vendorAmount,
        });
        await handleTX(tx, "Stake");
      }}
      onMaxClick={() => {
        setVendorAmountStr(vendorBalance?.balance.toExact() ?? "");
      }}
    />
  );
};
