import { useSail } from "@saberhq/sail";
import { useSolana } from "@saberhq/use-solana";
import pluralize from "pluralize";
import invariant from "tiny-invariant";

import { useSmartWallet } from "../../../../../../hooks/useSmartWallet";
import { AsyncButton } from "../../../../../common/AsyncButton";
import { Button } from "../../../../../common/Button";
import { useTransaction } from "../context";

export const Actions: React.FC = () => {
  const { state, id, tx, title, numSigned } = useTransaction();
  const { smartWallet, threshold, smartWalletData } = useSmartWallet();
  const { handleTX } = useSail();
  const { providerMut } = useSolana();

  const isOwner = !!(
    providerMut &&
    smartWalletData?.accountInfo.data.owners.find((o) =>
      o.equals(providerMut.wallet.publicKey)
    )
  );

  return (
    <>
      {state === "active" && (
        <div tw="p-4 border w-full my-4 text-sm flex flex-col gap-4">
          <div>
            <h2 tw="font-medium mb-1.5">More Signatures Required</h2>
            <p tw="text-secondary text-xs">
              This transaction still requires {(threshold ?? 0) - numSigned}{" "}
              more {pluralize("signature", (threshold ?? 0) - numSigned)} to be
              able to executed.
            </p>
          </div>
          {isOwner && (
            <div>
              <Button
                variant="primary"
                onClick={async () => {
                  invariant(smartWallet, "smart wallet");
                  const txEnv = smartWallet.approveTransaction(tx.accountId);
                  await handleTX(txEnv, `Approve ${id}: ${title}`);
                }}
              >
                Approve
              </Button>
            </div>
          )}
        </div>
      )}
      {state === "approved" && (
        <div tw="p-4 border w-full my-4 text-sm flex flex-col gap-4">
          <div>
            <h2 tw="font-medium mb-1.5">Transaction Approved</h2>
            <p tw="text-secondary text-xs">
              The transaction has been approved by the minimum number of
              signers.
            </p>
          </div>
          {isOwner && (
            <div>
              <AsyncButton
                variant="primary"
                onClick={async () => {
                  invariant(smartWallet, "smart wallet");
                  const txEnv = await smartWallet.executeTransaction({
                    transactionKey: tx.accountId,
                  });
                  await handleTX(txEnv, `Execute ${id}: ${title}`);
                }}
              >
                Execute {id}
              </AsyncButton>
            </div>
          )}
        </div>
      )}
    </>
  );
};
