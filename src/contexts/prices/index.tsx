import type { CoinGeckoPrices } from "@sunnyag/react-coingecko";
import { useCoinGeckoPrices } from "@sunnyag/react-coingecko";
import { useMemo } from "react";
import { createContainer } from "unstated-next";

import { useEnvironment } from "../../utils/useEnvironment";

const usePricesInternal = (): CoinGeckoPrices<string> => {
  const { tokens } = useEnvironment();
  const coingeckoIDs = useMemo(
    () => [
      ...new Set([
        ...(tokens
          .map((tok) => tok.info.extensions?.coingeckoId)
          .filter((x): x is string => !!x) ?? []),
        "solana",
      ]),
    ],
    [tokens]
  );

  const { prices: coingeckoPrices } = useCoinGeckoPrices(coingeckoIDs);
  return { ...coingeckoPrices };
};

export const { Provider: PricesProvider, useContainer: usePrices } =
  createContainer(usePricesInternal);
