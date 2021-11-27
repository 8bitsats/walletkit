import type { SmartWalletWrapper } from "@gokiprotocol/client/dist/cjs/wrappers/smartWallet";
import type { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";

import { useSDK } from "../contexts/sdk";

const useSmartWalletInner = (key?: PublicKey) => {
  if (!key) {
    throw new Error("missing key");
  }
  const { sdkMut } = useSDK();
  const [smartWallet, setSmartWallet] = useState<SmartWalletWrapper | null>(
    null
  );

  useEffect(() => {
    if (!sdkMut) {
      setSmartWallet(null);
      return;
    }
    void (async () => {
      const sw = await sdkMut.loadSmartWallet(key);
      setSmartWallet(sw);
    })();
  }, [key, sdkMut]);

  return { smartWallet };
};

export const { useContainer: useSmartWallet, Provider: SmartWalletProvider } =
  createContainer(useSmartWalletInner);
