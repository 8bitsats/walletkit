import { findMinterAddress, QUARRY_CODERS } from "@quarryprotocol/quarry-sdk";
import {
  RedeemerWrapper,
  Saber,
  SABER_ADDRESSES,
} from "@saberhq/saber-periphery";
import {
  TOKEN_ACCOUNT_PARSER,
  useAccountData,
  useParsedAccountData,
  usePubkey,
  useSail,
} from "@saberhq/sail";
import { buildStubbedTransaction, PublicKey } from "@saberhq/solana-contrib";
import {
  getATAAddress,
  getOrCreateATA,
  TOKEN_PROGRAM_ID,
} from "@saberhq/token-utils";
import { useSolana } from "@saberhq/use-solana";
import type { TransactionInstruction } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";

import { useParseTokenAmount } from "../../../../../../../hooks/useParseTokenAmount";
import { serializeToBase64 } from "../../../../../../../utils/makeTransaction";
import { useParsedMintWrapper } from "../../../../../../../utils/parsers";
import { AsyncButton } from "../../../../../../common/AsyncButton";
import { HelperCard } from "../../../../../../common/HelperCard";
import { InputText } from "../../../../../../common/inputs/InputText";
import { InputTokenAmount } from "../../../../../../common/inputs/InputTokenAmount";
import { useGovernor } from "../../../../hooks/useGovernor";

interface Props {
  setError: (err: string | null) => void;
  setTxRaw: (txRaw: string) => void;
}

export const IssueTokensAction: React.FC<Props> = ({
  setError,
  setTxRaw,
}: Props) => {
  const { govToken, smartWallet, meta } = useGovernor();
  const [amountStr, setAmountStr] = useState<string>("");
  const [destinationStr, setDestinationStr] = useState<string>("");
  const { network, providerMut } = useSolana();
  const amount = useParseTokenAmount(govToken, amountStr);
  const destination = usePubkey(destinationStr);
  const { handleTX } = useSail();

  const minter = meta?.minter;
  const mintWrapper = useMemo(
    () => (minter ? new PublicKey(minter.mintWrapper) : null),
    [minter]
  );
  const { data: mintWrapperData } = useParsedMintWrapper(mintWrapper);
  const redeemer = useMemo(
    () => (minter?.redeemer ? new PublicKey(minter.redeemer) : null),
    [minter?.redeemer]
  );
  const { data: redeemerData } = useAccountData(redeemer);

  const { data: iouATAKey } = useQuery(
    [
      "ata",
      mintWrapperData?.accountInfo.data.tokenMint,
      smartWallet?.toString(),
    ],
    async () => {
      invariant(mintWrapperData && smartWallet);
      return await getATAAddress({
        mint: mintWrapperData.accountInfo.data.tokenMint,
        owner: smartWallet,
      });
    },
    { enabled: !!mintWrapperData && !!smartWallet }
  );
  const { data: iouATA } = useParsedAccountData(
    iouATAKey,
    TOKEN_ACCOUNT_PARSER
  );

  useEffect(() => {
    if (
      !providerMut ||
      !mintWrapper ||
      !smartWallet ||
      !amount ||
      !destination ||
      !mintWrapperData ||
      (redeemer && !redeemerData) ||
      !govToken
    ) {
      return;
    }
    void (async () => {
      const [minter] = await findMinterAddress(mintWrapper, smartWallet);

      const ixs: TransactionInstruction[] = [];

      const iouTokens = await getATAAddress({
        mint: mintWrapperData.accountInfo.data.tokenMint,
        owner: smartWallet,
      });
      const mintIX = QUARRY_CODERS.MintWrapper.encodeIX(
        "performMint",
        { amount: amount.toU64() },
        {
          mintWrapper,
          minterAuthority: smartWallet,
          destination: iouTokens,
          minter,
          tokenMint: mintWrapperData.accountInfo.data.tokenMint,
          tokenProgram: TOKEN_PROGRAM_ID,
        }
      );
      ixs.push(mintIX);

      if (redeemerData) {
        if (redeemerData.accountInfo.owner.equals(SABER_ADDRESSES.Redeemer)) {
          // handle mint proxy redemption
          const redeemerW = await RedeemerWrapper.load({
            sdk: Saber.load({ provider: providerMut }),
            iouMint: mintWrapperData.accountInfo.data.tokenMint,
            redemptionMint: govToken.mintAccount,
          });

          const redeemIX = await redeemerW.redeemAllTokensFromMintProxyIx({
            sourceAuthority: smartWallet,
            iouSource: iouTokens,
            redemptionDestination: destination,
          });
          ixs.push(redeemIX);
        }
      }

      try {
        const txStub = buildStubbedTransaction(
          network !== "localnet" ? network : "devnet",
          ixs
        );
        setTxRaw(serializeToBase64(txStub));
        setError(null);
      } catch (ex) {
        setTxRaw("");
        console.debug("Error issuing tokens", ex);
        setError("Error generating proposal");
      }
    })();
  }, [
    amount,
    destination,
    govToken,
    mintWrapper,
    mintWrapperData,
    network,
    providerMut,
    redeemer,
    redeemerData,
    setError,
    setTxRaw,
    smartWallet,
  ]);

  return (
    <>
      <HelperCard>
        Issue tokens on behalf of the DAO. This can be used for grants,
        liquidity mining, and more.
      </HelperCard>
      <InputTokenAmount
        label="Amount"
        token={govToken ?? null}
        tokens={[]}
        tw="h-auto"
        inputValue={amountStr}
        inputDisabled={!smartWallet}
        inputOnChange={(e) => {
          setAmountStr(e);
        }}
      />
      <label tw="flex flex-col gap-1" htmlFor="destination">
        <span tw="text-sm">Destination</span>
        <InputText
          id="destination"
          placeholder="Destination SBR token account."
          value={destinationStr}
          onChange={(e) => {
            setDestinationStr(e.target.value);
          }}
        />
      </label>
      {iouATAKey && iouATA === null && (
        <AsyncButton
          disabled={!mintWrapperData || !smartWallet}
          onClick={async (sdkMut) => {
            invariant(mintWrapperData && smartWallet);
            const { instruction } = await getOrCreateATA({
              provider: sdkMut.provider,
              mint: mintWrapperData.accountInfo.data.tokenMint,
              owner: smartWallet,
            });
            const { pending, success } = await handleTX(
              sdkMut.provider.newTX([instruction]),
              "Create ATA"
            );
            if (!success || !pending) {
              return;
            }
            await pending.wait();
          }}
        >
          Create IOU ATA
        </AsyncButton>
      )}
    </>
  );
};
