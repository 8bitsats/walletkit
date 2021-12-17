import { useSail } from "@saberhq/sail";
import { Keypair } from "@solana/web3.js";
import BN from "bn.js";
import { useState } from "react";
import { FaDice } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../../contexts/sdk";
import {
  useOwnerInvokerAddress,
  useSmartWalletAddress,
} from "../../../../../hooks/useSmartWalletAddress";
import { handleException } from "../../../../../utils/error";
import { notify } from "../../../../../utils/notifications";
import { AsyncButton } from "../../../../common/AsyncButton";
import { Button } from "../../../../common/Button";
import { InputText } from "../../../../common/inputs/InputText";

export const DAOStep2ExecutiveView: React.FC = () => {
  const [baseKP, setBaseKP] = useState<Keypair>(Keypair.generate());
  const { data: smartWalletKey } = useSmartWalletAddress(baseKP.publicKey);
  const { data: ownerInvokerKey } = useOwnerInvokerAddress(baseKP.publicKey);
  const { sdkMut } = useSDK();
  const { handleTX } = useSail();
  const history = useHistory();

  return (
    <div tw="grid gap-12 w-full max-w-sm mx-auto">
      <div>
        <div tw="mb-8">
          <h1 tw="font-bold text-2xl mb-4 dark:text-gray-50">
            Create the Executive Council
          </h1>
        </div>
        <div tw="flex flex-col items-center gap-16">
          <div tw="prose prose-sm dark:prose-light">
            <p>
              The Executive Council is a Smart Wallet which allows trusted
              individuals to carry out the execution of governance proposals.
            </p>
            <p>
              The DAO will be configured to allow any member of the Smart Wallet
              to execute a transaction once it has been queued by Tribeca.
            </p>
            <p>
              This protects your DAO from frontrunning, sandwich attacks, MEV
              exploits, and other common attacks resulting from arbitrary
              parties being able to execute a proposal.
            </p>
          </div>
          <div tw="flex flex-col w-full gap-4">
            <div tw="flex flex-col w-full">
              <span tw="text-xs mb-1.5">Executive Council Key</span>
              <div tw="flex gap-2 w-full">
                <InputText
                  tw="h-10 flex-grow"
                  disabled
                  value={ownerInvokerKey?.toString()}
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
            <div tw="flex flex-col w-full">
              <span tw="text-xs mb-1.5">Smart Wallet</span>
              <div tw="flex gap-2 w-full">
                <InputText
                  tw="h-10 flex-grow"
                  disabled
                  value={smartWalletKey?.toString()}
                />
              </div>
            </div>
          </div>
          <div>
            <AsyncButton
              size="md"
              variant="primary"
              disabled={!ownerInvokerKey}
              onClick={async () => {
                try {
                  invariant(sdkMut && ownerInvokerKey, "sdk");
                  const { tx } = await sdkMut.newSmartWallet({
                    owners: [sdkMut.provider.wallet.publicKey],
                    threshold: new BN(1),
                    // default to 11 max owners
                    // if people complain about cost, we can reduce this
                    numOwners: 11,
                    base: baseKP,
                  });
                  notify({
                    message: "Creating the Executive Council",
                    description:
                      "Please sign the transaction in your wallet to continue.",
                  });
                  const { pending, success } = await handleTX(
                    tx,
                    "Create Executive Council"
                  );
                  if (!success || !pending) {
                    return;
                  }
                  await pending.wait({ commitment: "confirmed" });

                  notify({
                    message: `Executive Council created successfully`,
                    description: `Invoker: ${ownerInvokerKey.toString()}`,
                  });
                  history.push(
                    `/onboarding/dao/create-emergency?executive=${ownerInvokerKey.toString()}`
                  );
                } catch (e) {
                  handleException(e, {
                    source: "create-ec",
                  });
                }
              }}
            >
              Create Executive Council
            </AsyncButton>
          </div>
        </div>
      </div>
    </div>
  );
};
