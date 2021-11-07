import type { ArrowData } from "@arrowprotocol/arrow";
import { ARROW_FEE_OWNER } from "@arrowprotocol/arrow";
import { useSail } from "@saberhq/sail";
import { TransactionEnvelope } from "@saberhq/solana-contrib";
import { getOrCreateATA } from "@saberhq/token-utils";
import type { PublicKey, TransactionInstruction } from "@solana/web3.js";
import invariant from "tiny-invariant";

import { AsyncButton } from "../../common/AsyncButton";

interface Props {
  arrowKey?: PublicKey;
  arrowData?: ArrowData;
}

export const Actions: React.FC<Props> = ({ arrowKey, arrowData }: Props) => {
  const { handleTX, handleTXs } = useSail();
  return (
    <div>
      <AsyncButton
        disabled={!arrowData || !arrowKey}
        onClick={async (sdkMut) => {
          invariant(arrowData, "arrowData");
          invariant(arrowKey, "arrowKey");
          const createATAIXs = (
            await Promise.all(
              [
                arrowData.vendorMiner.rewardsMint,
                arrowData.internalMiner.rewardsMint,
              ].map(async (mint) => {
                return await Promise.all(
                  [
                    ARROW_FEE_OWNER,
                    arrowKey,
                    arrowData.pool,
                    arrowData.beneficiary,
                  ].map(async (owner) => {
                    return await getOrCreateATA({
                      provider: sdkMut.provider,
                      mint,
                      owner,
                    });
                  })
                );
              })
            )
          )
            .flat()
            .map((ata) => ata.instruction)
            .filter((ix): ix is TransactionInstruction => !!ix);

          if (createATAIXs.length > 0) {
            const { success, pending } = await handleTX(
              new TransactionEnvelope(sdkMut.provider, createATAIXs),
              "Create ATAs"
            );
            if (!success || !pending) {
              return;
            }
            await pending.wait();
          }

          const { vendorTX, internalTX } = await sdkMut.claim({
            arrowMint: arrowData.mint,
          });
          await handleTXs([vendorTX, internalTX], "Claim");
        }}
      >
        Claim Rewards for Beneficiary
      </AsyncButton>
    </div>
  );
};
