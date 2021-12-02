import type { Network } from "@saberhq/solana-contrib";
import type { ChainId } from "@saberhq/token-utils";
import { networkToChainId, Token } from "@saberhq/token-utils";
import { useConnectionContext } from "@saberhq/use-solana";
import * as Sentry from "@sentry/react";
import { ENV } from "@solana/spl-token-registry";
import { useEffect, useMemo } from "react";
import { createContainer } from "unstated-next";

import { useTokenList } from "../hooks/api/useTokenList";
import type { IEnvironment } from "./environments";
import { environments } from "./environments";

export const envs = {
  "mainnet-beta": ENV.MainnetBeta,
  devnet: ENV.Devnet,
  testnet: ENV.Testnet,
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
  const { network } = useConnectionContext();
  useEffect(() => {
    Sentry.setContext("network", {
      network,
    });
  }, [network]);

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
