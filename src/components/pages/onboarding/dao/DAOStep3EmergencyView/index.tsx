import { useSail } from "@saberhq/sail";
import { Keypair } from "@solana/web3.js";
import BN from "bn.js";
import { useState } from "react";
import { FaDice } from "react-icons/fa";
import { useHistory, useLocation } from "react-router-dom";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../../contexts/sdk";
import { useSmartWalletAddress } from "../../../../../hooks/useSmartWalletAddress";
import { handleException } from "../../../../../utils/error";
import { notify } from "../../../../../utils/notifications";
import { AsyncButton } from "../../../../common/AsyncButton";
import { Button } from "../../../../common/Button";
import { InputText } from "../../../../common/inputs/InputText";

export const DAOStep3EmergencyView: React.FC = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const executive = urlParams.get("executive");

  const [baseKP, setBaseKP] = useState<Keypair>(Keypair.generate());
  const { data: smartWalletKey } = useSmartWalletAddress(baseKP.publicKey);
  const { sdkMut } = useSDK();
  const { handleTX } = useSail();
  const history = useHistory();

  return (
    <div tw="grid gap-12 w-full max-w-sm mx-auto">
      <div>
        <div tw="mb-8">
          <h1 tw="font-bold text-2xl mb-4 dark:text-gray-50">
            Create the Emergency Multisig
          </h1>
        </div>
        <div tw="flex flex-col items-center gap-16">
          <div tw="prose prose-sm dark:prose-light">
            <p>
              The Emergency Multisig is intended to be used for occasions where
              trusted parties determine one should bypass governance.
            </p>
            <p>
              For now, we'll add your wallet to the Emergency Multisig. You will
              want to add other members, e.g. other protocols or developers in
              the space that are well known and trusted, in the future.
            </p>
          </div>
          <div tw="flex flex-col w-full">
            <span tw="text-xs mb-1.5">Emergency Multisig Address</span>
            <div tw="flex gap-2 w-full">
              <InputText
                tw="h-10 flex-grow"
                disabled
                value={smartWalletKey?.toString()}
              />
              <Button
                tw="flex items-center gap-2 h-10"
                onClick={() => {
                  setBaseKP(Keypair.generate());
                }}
              >
                <span>Reroll</span>
                <FaDice />
              </Button>
            </div>
          </div>
          <div>
            <AsyncButton
              size="md"
              variant="primary"
              disabled={!executive}
              onClick={async () => {
                invariant(executive, "executive");
                try {
                  invariant(sdkMut, "sdk");
                  const { tx, smartWalletWrapper } =
                    await sdkMut.newSmartWallet({
                      owners: [sdkMut.provider.wallet.publicKey],
                      threshold: new BN(1),
                      // default to 11 max owners
                      // if people complain about cost, we can reduce this
                      numOwners: 11,
                      base: baseKP,
                    });
                  notify({
                    message: "Creating the Emergency Multisig",
                    description:
                      "Please sign the transaction in your wallet to continue.",
                  });
                  const { pending, success } = await handleTX(
                    tx,
                    "Create Emergency Multisig"
                  );
                  if (!success || !pending) {
                    return;
                  }
                  await pending.wait({ commitment: "confirmed" });

                  notify({
                    message: `Wallet created successfully`,
                    description: smartWalletWrapper.key.toString(),
                  });
                  history.push(
                    `/onboarding/dao/create-dao?executive=${executive.toString()}&emergency=${smartWalletWrapper.key.toString()}`
                  );
                } catch (e) {
                  handleException(e, {
                    source: "create-multisig",
                  });
                }
              }}
            >
              Create Emergency Multisig
            </AsyncButton>
          </div>
        </div>
      </div>
    </div>
  );
};
