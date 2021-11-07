import type { Network } from "@saberhq/solana-contrib";
import type { TokenList } from "@solana/spl-token-registry";
import { useMemo } from "react";

import tokenListDevnet from "./data/token-list.devnet.json";
import tokenListMainnet from "./data/token-list.mainnet.json";

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
    return {
      ...list,
      tokens: [...list.tokens],
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
