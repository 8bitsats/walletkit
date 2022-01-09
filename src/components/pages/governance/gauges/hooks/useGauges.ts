import { findGaugeAddress } from "@quarryprotocol/gauge";
import { findQuarryAddress } from "@quarryprotocol/quarry-sdk";
import { useRewarder, useToken } from "@quarryprotocol/react-quarry";
import type { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";

import {
  useParsedGauge,
  useParsedGaugemeister,
  useParsedGauges,
} from "../../../../../utils/parsers";
import { useGaugemeister } from "./useGaugemeister";

export const useGaugeKeys = () => {
  const gaugemeister = useGaugemeister();
  const { allStakedTokenMints, rewarderKey, registry } = useRewarder();
  const { data: gaugeKeys } = useQuery(
    ["gaugeKeys", gaugemeister?.toString(), rewarderKey.toString()],
    async () => {
      invariant(allStakedTokenMints && gaugemeister);
      const keys = await Promise.all(
        allStakedTokenMints.map(async (stakedTokenMint) => {
          const [quarryKey] = await findQuarryAddress(
            rewarderKey,
            stakedTokenMint
          );
          const [key] = await findGaugeAddress(gaugemeister, quarryKey);
          return key;
        }) ?? []
      );
      return keys;
    },
    {
      enabled:
        allStakedTokenMints !== undefined && !!registry && !!gaugemeister,
    }
  );
  return gaugeKeys;
};

export const useGauge = (stakedTokenMint: PublicKey | null | undefined) => {
  const gaugemeister = useGaugemeister();
  const gm = useParsedGaugemeister(gaugemeister);
  const rewarderKey = gm.data?.accountInfo.data.rewarder;
  const { data: gaugeKey } = useQuery(
    [
      "gaugeKeyForStakedToken",
      gaugemeister?.toString(),
      stakedTokenMint?.toString(),
    ],
    async () => {
      invariant(rewarderKey && stakedTokenMint && gaugemeister);
      const [quarryKey] = await findQuarryAddress(rewarderKey, stakedTokenMint);
      const [key] = await findGaugeAddress(gaugemeister, quarryKey);
      return key;
    },
    { enabled: !!rewarderKey && !!stakedTokenMint && !!gaugemeister }
  );
  const { data: gauge } = useParsedGauge(gaugeKey);
  const token = useToken(stakedTokenMint);
  return { gaugeKey, gauge, token };
};

export const useAllGauges = () => {
  const gaugeKeys = useGaugeKeys();
  const gauges = useParsedGauges(useMemo(() => gaugeKeys ?? [], [gaugeKeys]));
  return { gauges, gaugeKeys };
};
