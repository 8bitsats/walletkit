import { useSail } from "@saberhq/sail";
import { Keypair } from "@solana/web3.js";
import BN from "bn.js";
import { useState } from "react";
import { FaDice } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../../contexts/sdk";
import { useSmartWalletAddress } from "../../../../../hooks/useSmartWalletAddress";
import { handleException } from "../../../../../utils/error";
import { notify } from "../../../../../utils/notifications";
import { AsyncButton } from "../../../../common/AsyncButton";
import { Button } from "../../../../common/Button";
import { InputText } from "../../../../common/inputs/InputText";

export const DAOStep2ExecutiveView: React.FC = () => {
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
            Create the Executive Multisig
          </h1>
        </div>
        <div tw="flex flex-col items-center gap-16">
          <div tw="prose prose-sm dark:prose-light">
            <p>
              The Executive Multisig is a 1-of-n multisig wallet which allows
              trusted parties to carry out the execution of governance
              proposals.
            </p>
            <p>
              Adding permissions to this wallet prevents frontrunning, sandwich
              attacks, and other undesired behaviors from interacting with your
              wallet.
            </p>
          </div>
          <div tw="flex flex-col w-full">
            <span tw="text-xs mb-1.5">Executive Key</span>
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
              onClick={async () => {
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
                    message: "Creating the Executive Multisig",
                    description:
                      "Please sign the transaction in your wallet to continue.",
                  });
                  const { pending, success } = await handleTX(
                    tx,
                    "Create Executive Multisig"
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
                    `/onboarding/dao/create-emergency?executive=${smartWalletWrapper.key.toString()}`
                  );
                } catch (e) {
                  handleException(e, {
                    source: "create-multisig",
                  });
                }
              }}
            >
              Create Executive Multisig
            </AsyncButton>
          </div>
        </div>
      </div>
    </div>
  );
};
