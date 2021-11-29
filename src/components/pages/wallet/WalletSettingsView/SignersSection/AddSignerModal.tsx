import { usePubkey, useSail } from "@saberhq/sail";
import { useState } from "react";
import invariant from "tiny-invariant";

import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { notify } from "../../../../../utils/notifications";
import { shortenAddress } from "../../../../../utils/utils";
import { AddressLink } from "../../../../common/AddressLink";
import { AsyncButton } from "../../../../common/AsyncButton";
import { Modal } from "../../../../common/Modal";

interface Props {
  isOpen: boolean;
  onDismiss: () => void;
}

export const AddSignerModal: React.FC<Props> = ({
  isOpen,
  onDismiss,
}: Props) => {
  const { smartWallet } = useSmartWallet();
  const [newOwner, setNewOwner] = useState<string>("");
  const newOwnerKey = usePubkey(newOwner);
  const { handleTX } = useSail();

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} tw="p-0">
      <div tw="h-14 flex items-center px-8">
        <h1 tw="font-medium text-base">Add signer</h1>
      </div>
      <div tw="px-8 py-6 grid gap-6">
        <input
          type="text"
          placeholder="Address of signer"
          value={newOwner}
          onChange={(e) => {
            setNewOwner(e.target.value);
          }}
        />
        <div>
          <AsyncButton
            variant="primary"
            disabled={!newOwnerKey}
            onClick={async () => {
              invariant(smartWallet, "smart wallet");
              invariant(newOwnerKey, "new owner key");

              const swData = await smartWallet.reloadData();
              const tx = smartWallet.setOwners([...swData.owners, newOwnerKey]);
              const pendingTX = await smartWallet.newTransaction({
                instructions: tx.instructions,
              });

              notify({
                message: `Adding ${shortenAddress(
                  newOwnerKey.toString()
                )} to wallet`,
                description: (
                  <>
                    Proposing a transaction to add{" "}
                    <AddressLink address={newOwnerKey} /> to the wallet. You may
                    need to contact the other signers.
                  </>
                ),
              });
              const { success, pending } = await handleTX(
                pendingTX.tx,
                `Add ${shortenAddress(newOwnerKey.toString())} to wallet`
              );

              if (!success || !pending) {
                return;
              }
              await pending.wait();

              setNewOwner("");
              onDismiss();
            }}
          >
            Add signer
          </AsyncButton>
        </div>
      </div>
    </Modal>
  );
};
