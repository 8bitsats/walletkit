import type { Network } from "@saberhq/solana-contrib";
import { ChainId, networkToChainId, Token } from "@saberhq/token-utils";
import { useConnectionContext } from "@saberhq/use-solana";
import * as Sentry from "@sentry/react";
import { useEffect, useMemo } from "react";
import { createContainer } from "unstated-next";

import { SOLE_NETWORK } from "../contexts/wallet";
import { useTokenList } from "../hooks/api/useTokenList";
import type { IEnvironment } from "./environments";
import { environments } from "./environments";

export const envs = {
  "mainnet-beta": ChainId.MainnetBeta,
  devnet: ChainId.Devnet,
  testnet: ChainId.Testnet,
} as const;

interface UseEnvironment {
  loading: boolean;
  name: string;
  endpoint: string;

  tokens: readonly Token[];
  tokenMap: Record<string, Token> | null;
  chainId: ChainId | null;
  environments: { [N in Network]: IEnvironment };
}

const useEnvironmentInternal = (): UseEnvironment => {
  const { network, setNetwork } = useConnectionContext();
  useEffect(() => {
    Sentry.setContext("network", {
      network,
    });
  }, [network]);

  useEffect(() => {
    if (SOLE_NETWORK && SOLE_NETWORK !== network) {
      setNetwork(SOLE_NETWORK);
    }
  });

  const environment: IEnvironment = environments[network];
  const chainId: ChainId = useMemo(() => networkToChainId(network), [network]);
  const { data } = useTokenList(network);
  const tokenList = useMemo(
    () => data.tokens.map((token) => new Token(token)),
    [data.tokens]
  );

  const tokenMap: Record<string, Token> | null = useMemo(() => {
    if (!tokenList) {
      return null;
    }
    const nextTokenMap = tokenList.reduce((map, item) => {
      map[item.address] = item;
      return map;
    }, {} as Record<string, Token>);
    return nextTokenMap;
  }, [tokenList]);

  return {
    loading: false,
    name: environment.name,
    endpoint: environment.endpoint,
    tokens: tokenList,
    tokenMap,
    chainId,
    environments,
  };
};

export const { Provider: EnvironmentProvider, useContainer: useEnvironment } =
  createContainer(useEnvironmentInternal);
