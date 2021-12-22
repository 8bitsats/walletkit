import type { Network } from "@saberhq/solana-contrib";
import type { TokenList } from "@saberhq/token-utils";
import { RAW_SOL, WRAPPED_SOL } from "@saberhq/token-utils";
import { useMemo } from "react";

import { getGovTokensForNetwork } from "../../config/governors";
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
    const sol = RAW_SOL[network];
    const wsol = WRAPPED_SOL[network];
    return {
      ...list,
      tokens: [
        ...list.tokens,
        ...getGovTokensForNetwork(network),
        sol.info,
        wsol.info,
      ],
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
