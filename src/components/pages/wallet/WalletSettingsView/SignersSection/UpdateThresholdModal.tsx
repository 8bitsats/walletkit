import { useSail } from "@saberhq/sail";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import invariant from "tiny-invariant";

import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { notify } from "../../../../../utils/notifications";
import { AsyncButton } from "../../../../common/AsyncButton";
import { InputText } from "../../../../common/inputs/InputText";
import { Modal } from "../../../../common/Modal";

interface Props {
  isOpen: boolean;
  onDismiss: () => void;
}

export const UpdateThresholdModal: React.FC<Props> = ({
  isOpen,
  onDismiss,
}: Props) => {
  const { smartWallet, smartWalletData, key } = useSmartWallet();
  const [thresholdStr, setThresholdStr] = useState<string>(
    smartWalletData?.accountInfo.data.threshold.toString() ?? ""
  );
  const { handleTX } = useSail();
  const history = useHistory();

  const numSigners = smartWalletData?.accountInfo.data.owners.length;
  const nextThreshold = (() => {
    try {
      return parseInt(thresholdStr);
    } catch (e) {
      return null;
    }
  })();

  useEffect(() => {
    setThresholdStr(
      smartWalletData?.accountInfo.data.threshold.toString() ?? ""
    );
  }, [smartWalletData?.accountInfo.data.threshold]);

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} tw="p-0">
      <div tw="h-14 flex items-center px-8">
        <h1 tw="font-medium text-base">Update Minimum Signers Threshold</h1>
      </div>
      <div tw="px-8 py-6 grid gap-6">
        <label htmlFor="threshold" tw="flex flex-col gap-2 text-sm">
          <span tw="font-medium">Minimum Signers Threshold</span>
          <InputText
            id="threshold"
            type="number"
            placeholder="Minimum number of signers"
            value={thresholdStr}
            onChange={(e) => {
              setThresholdStr(e.target.value);
            }}
          />
        </label>
        <div>
          <AsyncButton
            variant="primary"
            disabled={!nextThreshold || numSigners === undefined}
            onClick={async () => {
              invariant(smartWallet, "smart wallet");
              invariant(nextThreshold && numSigners);

              if (numSigners < nextThreshold) {
                notify({
                  message: `Threshold too high`,
                  description: `Threshold must be under the current number of signers, which is ${numSigners}. You specified ${nextThreshold}.`,
                });
              }

              const tx = smartWallet.changeThreshold(parseInt(thresholdStr));
              const pendingTX = await smartWallet.newTransaction({
                instructions: tx.instructions,
              });

              notify({
                message: `Updating minimum signers threshold to ${thresholdStr}`,
                description: (
                  <>
                    Proposing to set the minimum signers threshold to{" "}
                    {nextThreshold}. You may need to contact the other signers.
                  </>
                ),
              });
              const { success, pending } = await handleTX(
                pendingTX.tx,
                `Set minimum signers threshold to ${nextThreshold}`
              );

              if (!success || !pending) {
                return;
              }
              await pending.wait();

              setThresholdStr("");
              onDismiss();
              history.push(`/wallets/${key.toString()}/tx/${pendingTX.index}`);
            }}
          >
            Update threshold
          </AsyncButton>
        </div>
      </div>
    </Modal>
  );
};
