import { useState } from "react";

import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { AddressLink } from "../../../../common/AddressLink";
import { Button } from "../../../../common/Button";
import { AddSignerModal } from "./AddSignerModal";
import { UpdateThresholdModal } from "./UpdateThresholdModal";

enum SignerModal {
  UpdateThreshold,
  AddSigner,
}

export const SignersSection: React.FC = () => {
  const { smartWalletData } = useSmartWallet();
  const threshold = smartWalletData?.accountInfo?.data?.threshold.toNumber();

  const [signerModal, setSignerModal] = useState<SignerModal | null>(null);

  return (
    <div>
      <UpdateThresholdModal
        isOpen={signerModal === SignerModal.UpdateThreshold}
        onDismiss={() => {
          setSignerModal(null);
        }}
      />
      <AddSignerModal
        isOpen={signerModal === SignerModal.AddSigner}
        onDismiss={() => {
          setSignerModal(null);
        }}
      />
      <h2 tw="text-xl font-medium mb-1">Signers</h2>
      <p tw="text-secondary text-sm">
        A proposed transaction may only be executed if {threshold} of these
        addresses approve it.
      </p>
      <div tw="my-6 flex items-center gap-4">
        <Button
          variant="primary"
          onClick={() => {
            setSignerModal(SignerModal.UpdateThreshold);
          }}
        >
          Update Min. Signers Threshold
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            setSignerModal(SignerModal.AddSigner);
          }}
        >
          Add a signer
        </Button>
      </div>
      <div tw="text-sm">
        {smartWalletData?.accountInfo?.data?.owners.map((owner, i) => {
          return (
            <div
              key={`owner_${i}`}
              tw="h-11 flex items-center justify-between border-b px-2"
            >
              <AddressLink address={owner} />
              <Button variant="outline" size="sm" tw="text-xs h-7">
                Remove
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
