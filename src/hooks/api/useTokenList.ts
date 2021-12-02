import type { Network } from "@saberhq/solana-contrib";
import { makeTokenForAllNetworks, NATIVE_MINT } from "@saberhq/token-utils";
import type { TokenList } from "@solana/spl-token-registry";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";

import tokenListDevnet from "./data/token-list.devnet.json";
import tokenListMainnet from "./data/token-list.mainnet.json";

export const RAW_SOL_MINT = new PublicKey(
  "So11111111111111111111111111111111111111122"
);

export const SOL = makeTokenForAllNetworks({
  address: RAW_SOL_MINT.toString(),
  name: "Solana",
  symbol: "SOL",
  decimals: 9,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png",
});

export const WRAPPED_SOL = makeTokenForAllNetworks({
  address: NATIVE_MINT.toString(),
  name: "Wrapped Solana",
  symbol: "wSOL",
  decimals: 9,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png",
});

export const useTokenList = (
  network: Network
): {
  loading: boolean;
  data: TokenList;
} => {
  const data: TokenList | null = useMemo(() => {
    const list: TokenList | null =
      network === "mainnet-beta"
        ? tokenListMainnet
        : network === "devnet"
        ? tokenListDevnet
        : null;
    if (!list) {
      return null;
    }
    const sol = SOL[network];
    const wsol = WRAPPED_SOL[network];
    return {
      ...list,
      tokens: [...list.tokens, sol.info, wsol.info],
    };
  }, [network]);

  if (data === null) {
    throw new Error(`unsupported network: ${network}`);
  }

  return {
    loading: false,
    data,
  };
};
