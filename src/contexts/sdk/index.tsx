import { GokiSDK, GOKI_ADDRESSES } from "@gokiprotocol/client";
import { Wallet } from "@project-serum/anchor";
import { useNativeAccount } from "@saberhq/sail";
import { SolanaProvider } from "@saberhq/solana-contrib";
import type { TokenAmount } from "@saberhq/token-utils";
import { useConnectedWallet, useConnectionContext } from "@saberhq/use-solana";
import type { PublicKey } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import { useMemo } from "react";
import { createContainer } from "unstated-next";

export type ProgramKey = keyof typeof GOKI_ADDRESSES;

export const useSDKInternal = (): {
  sdk: GokiSDK;
  sdkMut: GokiSDK | null;
  owner: PublicKey | null;
  nativeBalance?: TokenAmount;
} => {
  const { connection, sendConnection } = useConnectionContext();
  const wallet = useConnectedWallet();

  const { sdk: sdk } = useMemo(() => {
    const provider = SolanaProvider.load({
      connection,
      sendConnection,
      wallet: new Wallet(Keypair.generate()),
      opts: {
        commitment: "recent",
      },
    });
    return {
      sdk: GokiSDK.load({ provider }),
    };
  }, [connection, sendConnection]);

  const { sdkMut: sdkMut } = useMemo(() => {
    if (!wallet) {
      return { sdkMut: null };
    }
    const provider = SolanaProvider.load({
      connection,
      sendConnection,
      wallet,
      opts: {
        commitment: "recent",
      },
    });
    return {
      sdkMut: GokiSDK.load({ provider }),
    };
  }, [connection, sendConnection, wallet]);

  const owner = useMemo(
    () => sdkMut?.provider.wallet.publicKey ?? null,
    [sdkMut?.provider.wallet.publicKey]
  );
  const { nativeBalance } = useNativeAccount();

  return {
    owner,
    nativeBalance,
    sdk,
    sdkMut: sdkMut ?? null,
  };
};

export const { useContainer: useSDK, Provider: SDKProvider } =
  createContainer(useSDKInternal);
