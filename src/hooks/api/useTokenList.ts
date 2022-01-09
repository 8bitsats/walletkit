import {
  findReplicaMintAddress,
  QUARRY_ADDRESSES,
} from "@quarryprotocol/quarry-sdk";
import type { TokenInfo, TokenList } from "@saberhq/token-utils";
import { useConnectionContext } from "@saberhq/use-solana";
import * as Sentry from "@sentry/react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const TOKEN_LIST_URLS: Record<string, string> = {
  "mainnet-beta":
    "https://raw.githubusercontent.com/QuarryProtocol/rewarder-list-build/master/mainnet-beta/token-list.json",
  devnet:
    "https://raw.githubusercontent.com/QuarryProtocol/rewarder-list-build/master/devnet/token-list.json",
};

export const useTokenList = (): {
  loading: boolean;
  data: TokenList | null | undefined;
} => {
  const { network } = useConnectionContext();
  const { data } = useSWR<TokenList>(TOKEN_LIST_URLS[network] ?? "", fetcher);
  if (data === null) {
    Sentry.captureException(new Error(`Invalid network ${network}`));
  }

  const [tokenList, setTokenList] = useState<TokenList | null | undefined>(
    data
  );
  useEffect(() => {
    if (!data) {
      setTokenList(data);
      return;
    }

    let cancelled = false;
    void (async () => {
      const tokens = (
        await Promise.all(
          data.tokens.map(async (token): Promise<TokenInfo[]> => {
            const [replicaMint] = await findReplicaMintAddress({
              primaryMint: new PublicKey(token.address),
              programId: QUARRY_ADDRESSES.MergeMine,
            });
            return [
              token,
              {
                ...token,
                symbol: `qr${token.symbol}`,
                name: `${token.name} (Replica)`,
                address: replicaMint.toString(),
                tags: [...(token.tags ?? []), "quarry-merge-mine-replica"],
                extensions: {
                  ...token.extensions,
                  underlyingTokens: [token.address],
                },
              },
            ];
          })
        )
      ).flat();
      if (cancelled) {
        return;
      }
      setTokenList({
        ...data,
        tokens,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [data]);

  return {
    loading: tokenList === undefined,
    data: tokenList,
  };
};
