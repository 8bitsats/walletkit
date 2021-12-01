import { useSail } from "@saberhq/sail";
import { Keypair } from "@solana/web3.js";
import BN from "bn.js";
import { useState } from "react";
import { FaDice } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../contexts/sdk";
import { useSmartWalletAddress } from "../../../../hooks/useSmartWalletAddress";
import { handleException } from "../../../../utils/error";
import { notify } from "../../../../utils/notifications";
import { AsyncButton } from "../../../common/AsyncButton";
import { Button } from "../../../common/Button";

export const WalletCreateSimpleView: React.FC = () => {
  const { handleTX } = useSail();
  const { sdkMut } = useSDK();

  const [baseKP, setBaseKP] = useState<Keypair>(Keypair.generate());
  const walletKey = useSmartWalletAddress(baseKP.publicKey);
  const history = useHistory();

  return (
    <div tw="grid gap-12 w-full max-w-sm mx-auto">
      <div>
        <div tw="mb-8">
          <h1 tw="font-bold text-3xl mb-4">Let's create a wallet</h1>
          <h2 tw="text-secondary font-medium text-sm">
            Goki Smart Wallet is a secure multisig wallet for managing funds and
            admin privileges.
          </h2>
        </div>
        <div tw="flex flex-col gap-16">
          <div>
            <h2 tw="font-medium mb-2">Your Wallet Address</h2>
            <div tw="flex items-center justify-between gap-4">
              <span tw="text-sm font-medium word-break[break-word]">
                {walletKey.data ? walletKey.data.toString() : "--"}
              </span>
              <Button
                tw="flex items-center gap-2"
                onClick={() => {
                  setBaseKP(Keypair.generate());
                }}
              >
                <span>Reroll</span>
                <FaDice />
              </Button>
            </div>
          </div>
          <div tw="mx-auto">
            <AsyncButton
              type="submit"
              tw="w-[200px]"
              variant="primary"
              size="md"
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
                    message: "Creating your Goki Smart Wallet",
                    description:
                      "Please sign the transaction in your wallet to continue.",
                  });
                  const { pending, success } = await handleTX(
                    tx,
                    "Create Multisig"
                  );
                  if (!success || !pending) {
                    return;
                  }
                  await pending.wait({ commitment: "confirmed" });

                  notify({
                    message: `Wallet created successfully`,
                    description: smartWalletWrapper.key.toString(),
                  });
                  history.push(`/wallets/${smartWalletWrapper.key.toString()}`);
                } catch (e) {
                  handleException(e, {
                    source: "create-multisig",
                  });
                }
              }}
            >
              Create Wallet
            </AsyncButton>
          </div>
        </div>
      </div>
    </div>
  );
};
