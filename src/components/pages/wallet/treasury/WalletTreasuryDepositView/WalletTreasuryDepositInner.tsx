import { utils } from "@project-serum/anchor";
import { useSail } from "@saberhq/sail";
import { SolanaAugmentedProvider } from "@saberhq/solana-contrib";
import type { Token } from "@saberhq/token-utils";
import {
  getOrCreateATA,
  SPLToken,
  TOKEN_PROGRAM_ID,
} from "@saberhq/token-utils";
import { TransactionInstruction } from "@solana/web3.js";
import { useState } from "react";
import invariant from "tiny-invariant";

import { useParseTokenAmount } from "../../../../../hooks/useParseTokenAmount";
import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { useUserTokenAccounts } from "../../../../../hooks/useTokenAccounts";
import { MEMO_PROGRAM_ID } from "../../../../../utils/constants";
import { AsyncButton } from "../../../../common/AsyncButton";
import { InputText } from "../../../../common/inputs/InputText";
import { InputTokenAmount } from "../../../../common/inputs/InputTokenAmount";

export const WalletTreasuryDepositInner: React.FC = () => {
  const { key } = useSmartWallet();
  const { data: userTokenAccounts, isLoading: userIsLoading } =
    useUserTokenAccounts();
  const { handleTX } = useSail();

  const isLoading = userIsLoading;

  const [token, setToken] = useState<Token | null>(null);
  const [amountStr, setAmountStr] = useState<string>("");
  const amount = useParseTokenAmount(token, amountStr);
  const [memo, setMemo] = useState<string>("");

  const selectedAccount = token
    ? userTokenAccounts?.find((t) => t?.balance.token.equals(token))
    : null;

  return (
    <div tw="p-4 w-full max-w-md mx-auto border rounded flex flex-col gap-4">
      <div tw="rounded border p-4 bg-gray-50">
        <InputTokenAmount
          label="Deposit Amount"
          isLoading={isLoading}
          tokens={
            userTokenAccounts
              ?.map((ta) => ta?.balance.token)
              .filter((t): t is Token => !!t) ?? []
          }
          token={token}
          onTokenSelect={setToken}
          inputValue={amountStr}
          inputOnChange={setAmountStr}
          currentAmount={
            selectedAccount
              ? {
                  amount: selectedAccount.balance,
                  allowSelect: true,
                }
              : undefined
          }
        />
      </div>
      <div tw="flex flex-col gap-2 text-sm">
        <span tw="font-medium">Memo (optional)</span>
        <InputText
          type="text"
          value={memo}
          onChange={(e) => {
            setMemo(e.target.value);
          }}
        />
      </div>
      <div>
        <AsyncButton
          variant="primary"
          size="md"
          tw="w-full"
          disabled={!selectedAccount || !amount}
          onClick={async (sdkMut) => {
            invariant(selectedAccount && amount, "selected account");
            const destATA = await getOrCreateATA({
              provider: sdkMut.provider,
              mint: selectedAccount.balance.token.mintAccount,
              owner: key,
            });
            const provider = new SolanaAugmentedProvider(sdkMut.provider);
            const transferIX = SPLToken.createTransferCheckedInstruction(
              TOKEN_PROGRAM_ID,
              selectedAccount.account,
              amount.token.mintAccount,
              destATA.address,
              sdkMut.provider.wallet.publicKey,
              [],
              amount.toU64(),
              amount.token.decimals
            );
            await handleTX(
              provider.newTX([
                destATA.instruction,
                transferIX,
                memo
                  ? new TransactionInstruction({
                      programId: MEMO_PROGRAM_ID,
                      keys: [],
                      data: Buffer.from(utils.bytes.utf8.encode(memo)),
                    })
                  : null,
              ]),
              `Deposit ${amount.formatUnits()} to Wallet`
            );
          }}
        >
          Deposit
        </AsyncButton>
      </div>
    </div>
  );
};
