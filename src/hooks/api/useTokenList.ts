import {
  findReplicaMintAddress,
  QUARRY_ADDRESSES,
} from "@quarryprotocol/quarry-sdk";
import type { TokenInfo, TokenList } from "@saberhq/token-utils";
import { ENV } from "@saberhq/token-utils";
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

const HARDCODED_MAINNET_TOKENS: Omit<TokenInfo, "chainId">[] = [
  {
    address: "EoNJJWQMdvMscCL7V6wNrGaDLi791sPZH1hSzHcwfsDj",
    symbol: "sr-PRT-CASH-LP",
    name: "Saros PRT-CASH LP",
    decimals: 2,
    logoURI: "https://saros.finance/favicon.png",
    extensions: {
      website:
        "https://saros.finance/pool/DmQkZMF5qGGK7Yh41BQcjSZrfBw1b6STXUozFzGQkdp7",
    },
  },
  {
    address: "DHvEBPxbUbDr53DZtr7tJ1Wm1S1UQGe67ZN6Ciyv7tHW",
    symbol: "sr-PORT-CASH-LP",
    name: "Saros PORT-CASH LP",
    decimals: 2,
    logoURI: "https://saros.finance/favicon.png",
    extensions: {
      website:
        "https://saros.finance/pool/nFroVdbLbVC65KwYTdNGjf5K7tsESxBdsrVMPhXHzeB",
    },
  },
  {
    address: "Gwr9C41tv51oAjD1gqzpsLP1sGJ4KRTvQCLtaaWi72YD",
    symbol: "sr-POLE-CASH-LP",
    name: "Saros POLE-CASH LP",
    decimals: 2,
    logoURI: "https://saros.finance/favicon.png",
    extensions: {
      website:
        "https://saros.finance/pool/HpT4jCwY5W4jAzNDfzFa21ggwZjXFtAfxAKdMexXw6Cx",
    },
  },
  {
    address: "4g7DwZVn8edcSYR34zE4Dm13YLH6ZvtXCNnaUyQSFy9w",
    symbol: "sr-C98-CASH-LP",
    name: "Saros C98-CASH LP",
    decimals: 2,
    logoURI: "https://saros.finance/favicon.png",
    extensions: {
      website:
        "https://saros.finance/pool/BXuLQsUovSpJRY7iHCsFDYTTGJpy38WKLSzkLvAWeAm1",
    },
  },
];

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
      if (network === "mainnet-beta") {
        tokens.push(
          ...HARDCODED_MAINNET_TOKENS.map((t) => ({
            ...t,
            chainId: ENV.MainnetBeta,
          }))
        );
      }
      setTokenList({
        ...data,
        tokens,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [data, network]);

  return {
    loading: tokenList === undefined,
    data: tokenList,
  };
};
