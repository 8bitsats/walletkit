import { useSail } from "@saberhq/sail";
import invariant from "tiny-invariant";

import { useSmartWallet } from "../../../../../../hooks/useSmartWallet";
import { AsyncButton } from "../../../../../common/AsyncButton";
import { Button } from "../../../../../common/Button";
import { useTransaction } from "../context";

export const Actions: React.FC = () => {
  const { state, id, tx, title } = useTransaction();
  const { smartWallet } = useSmartWallet();
  const { handleTX } = useSail();
  return (
    <>
      {state === "active" && (
        <div tw="p-4 border w-full my-4">
          <h2>Action Required</h2>
          <Button variant="outline">Approve</Button>
          <Button variant="outline">Reject</Button>
        </div>
      )}
      {state === "approved" && (
        <div tw="p-4 border w-full my-4 text-sm">
          <h3 tw="font-medium mb-2">Transaction Approved</h3>
          <p tw="text-secondary mb-4">
            The transaction has been approved by the minimum number of signers.
            You may now execute the transaction.
          </p>
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
    </>
  );
};
