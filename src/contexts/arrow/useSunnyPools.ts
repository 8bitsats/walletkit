import { generateSunnyPoolAddress } from "@arrowprotocol/arrow";
import {
  findQuarryAddress,
  findRegistryAddress,
} from "@quarryprotocol/quarry-sdk";
import { PARSE_REGISTRY } from "@quarryprotocol/react-quarry";
import { useAccountsData, useParsedAccountData } from "@saberhq/sail";
import type { KeyedAccountInfo, PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";

import { usePoolsInfo } from "../../hooks/api/usePoolsInfo";
import { SABER_REWARDER_KEY } from "../../utils/constants";

export interface SunnyPool {
  pool: PublicKey;
  quarry: PublicKey;
  mint: PublicKey;
  name: string;
}

/**
 * Finds all active Sunny pools.
 * @returns
 */
export const useSunnyPools = (): SunnyPool[] => {
  const [registryKey, setRegistryKey] = useState<PublicKey | null>(null);
  const [pools, setPools] = useState<SunnyPool[]>([]);
  const { data: poolsInfo } = usePoolsInfo();

  useEffect(() => {
    void (async () => {
      const [addr] = await findRegistryAddress(SABER_REWARDER_KEY);
      setRegistryKey(addr);
    })();
  }, []);

  const { data: registryData } = useParsedAccountData(
    registryKey,
    PARSE_REGISTRY
  );

  useEffect(() => {
    if (!registryData) {
      return;
    }
    void (async () => {
      const tokenMints = registryData.accountInfo.data.tokens;
      setPools(
        await Promise.all(
          tokenMints.map(async (mint) => {
            const [quarry] = await findQuarryAddress(SABER_REWARDER_KEY, mint);
            const [pool] = await generateSunnyPoolAddress({ quarry });
            const name =
              poolsInfo?.pools.find(
                (p) => p.lpToken.address === mint.toString()
              )?.name ?? `Pool for token ${mint.toString()}`;
            return { pool, quarry, mint, name };
          })
        )
      );
    })();
  }, [poolsInfo?.pools, registryData]);

  const poolsDataRaw = useAccountsData(
    useMemo(() => pools.map(({ pool }) => pool), [pools])
  );

  return useMemo(() => {
    const found = new Set(
      poolsDataRaw
        .filter((d): d is KeyedAccountInfo => !!d)
        .map(({ accountId }) => accountId.toString())
    );
    return pools.filter((p) => found.has(p.pool.toString()));
  }, [pools, poolsDataRaw]);
};
