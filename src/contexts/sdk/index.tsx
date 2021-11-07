import type { ARROW_ADDRESSES } from "@arrowprotocol/arrow";
import { Arrow } from "@arrowprotocol/arrow";
import { Wallet } from "@project-serum/anchor";
import { useNativeAccount } from "@saberhq/sail";
import { SolanaProvider } from "@saberhq/solana-contrib";
import type { TokenAmount } from "@saberhq/token-utils";
import { useConnectedWallet, useConnectionContext } from "@saberhq/use-solana";
import type { PublicKey } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import { useMemo } from "react";
import { createContainer } from "unstated-next";

export type ProgramKey = keyof typeof ARROW_ADDRESSES;

export const useSDKInternal = (): {
  sdk: Arrow;
  sdkMut: Arrow | null;
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
      sdk: Arrow.init(provider),
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
      sdkMut: Arrow.init(provider),
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
