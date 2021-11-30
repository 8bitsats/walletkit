import { utils } from "@project-serum/anchor";
import { useToken } from "@quarryprotocol/react-quarry";
import { usePubkey, useSail } from "@saberhq/sail";
import { SolanaAugmentedProvider } from "@saberhq/solana-contrib";
import type { Token } from "@saberhq/token-utils";
import {
  getOrCreateATA,
  SPLToken,
  TOKEN_PROGRAM_ID,
} from "@saberhq/token-utils";
import { TransactionInstruction } from "@solana/web3.js";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import invariant from "tiny-invariant";

import { useParseTokenAmount } from "../../../../../hooks/useParseTokenAmount";
import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { useTokenAccounts } from "../../../../../hooks/useTokenAccounts";
import { MEMO_PROGRAM_ID } from "../../../../../utils/constants";
import { shortenAddress } from "../../../../../utils/utils";
import { AsyncButton } from "../../../../common/AsyncButton";
import { InputText } from "../../../../common/inputs/InputText";
import { InputTokenAmount } from "../../../../common/inputs/InputTokenAmount";
import { BasicPage } from "../../../../common/page/BasicPage";

export const WalletTreasurySendView: React.FC = () => {
  const { tokenMint: tokenMintStr } = useParams<{ tokenMint: string }>();
  const { key, smartWallet } = useSmartWallet();
  const {
    data: treasuryTokenAccounts,
    isLoading: userIsLoading,
    isSuccess,
  } = useTokenAccounts(key);
  const { handleTX } = useSail();
  const history = useHistory();

  const isLoading = !isSuccess || userIsLoading;

  const [toStr, setToStr] = useState<string>("");
  const to = usePubkey(toStr);
  const token = useToken(usePubkey(tokenMintStr));
  const [amountStr, setAmountStr] = useState<string>("");
  const amount = useParseTokenAmount(token, amountStr);
  const [memo, setMemo] = useState<string>("");

  const selectedAccount = token
    ? treasuryTokenAccounts?.find((t) => t?.balance.token.equals(token))
    : null;

  return (
    <BasicPage title="Send funds" description="Send tokens to another account.">
      <div tw="p-4 w-full max-w-md mx-auto border rounded flex flex-col gap-4">
        <div tw="rounded border p-4 bg-gray-50">
          <InputTokenAmount
            label="Transfer Amount"
            isLoading={isLoading}
            tokens={
              treasuryTokenAccounts
                ?.map((ta) => ta?.balance.token)
                .filter((t): t is Token => !!t) ?? []
            }
            token={token ?? null}
            onTokenSelect={(nextToken) => {
              history.push(
                `/wallets/${key.toString()}/treasury/send/${nextToken.address}`
              );
            }}
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
          <span tw="font-medium">Recipient</span>
          <InputText
            type="text"
            value={toStr}
            placeholder={`Recipient's address`}
            onChange={(e) => {
              setToStr(e.target.value);
            }}
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
            disabled={!smartWallet || !selectedAccount || !amount || !to}
            onClick={async (sdkMut) => {
              invariant(
                smartWallet && selectedAccount && amount && to,
                "selected account"
              );
              const destATA = await getOrCreateATA({
                provider: sdkMut.provider,
                mint: amount.token.mintAccount,
                owner: to,
              });
              const provider = new SolanaAugmentedProvider(sdkMut.provider);
              const transferIX = SPLToken.createTransferCheckedInstruction(
                TOKEN_PROGRAM_ID,
                selectedAccount.account,
                amount.token.mintAccount,
                destATA.address,
                key,
                [],
                amount.toU64(),
                amount.token.decimals
              );
              const sendTX = provider.newTX([
                transferIX,
                memo
                  ? new TransactionInstruction({
                      programId: MEMO_PROGRAM_ID,
                      keys: [],
                      data: Buffer.from(utils.bytes.utf8.encode(memo)),
                    })
                  : null,
              ]);
              const { tx: proposeTX } = await smartWallet.newTransaction({
                instructions: sendTX.instructions,
              });
              await handleTX(
                provider.newTX([destATA.instruction]).combine(proposeTX),
                `Proposal: send ${amount.formatUnits()} to ${shortenAddress(
                  to.toString()
                )}`
              );
            }}
          >
            Send
          </AsyncButton>
        </div>
      </div>
    </BasicPage>
  );
};
