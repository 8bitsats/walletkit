import {
  findMinerAddress,
  findMinterAddress,
  findQuarryAddress,
  findRegistryAddress,
  findRewarderAddress,
} from "@quarryprotocol/quarry-sdk";
import { getATAAddress } from "@saberhq/token-utils";
import type { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";

export enum ProgramAddressType {
  ATA = "ATA",

  MINE_REWARDER = "MINE_REWARDER",
  MINE_QUARRY = "MINE_QUARRY",
  MINE_MINER = "MINE_MINER",

  MW_MINTER = "MW_MINTER",
  QUARRY_REGISTRY = "QUARRY_REGISTRY",
}

const strategies: {
  [T in ProgramAddressType]: (
    path: ProgramAddressInputPaths[T]
  ) => Promise<PublicKey>;
} = {
  [ProgramAddressType.ATA]: async ([mint, owner]) => {
    return await getATAAddress({
      mint,
      owner,
    });
  },
  [ProgramAddressType.MINE_REWARDER]: async ([base]) => {
    const [rewarder] = await findRewarderAddress(base);
    return rewarder;
  },
  [ProgramAddressType.MINE_QUARRY]: async ([rewarder, token]) => {
    const [quarry] = await findQuarryAddress(rewarder, token);
    return quarry;
  },
  [ProgramAddressType.MINE_MINER]: async ([rewarder, token, owner]) => {
    const [quarry] = await findQuarryAddress(rewarder, token);
    const [miner] = await findMinerAddress(quarry, owner);
    return miner;
  },

  [ProgramAddressType.MW_MINTER]: async ([mintWrapper, authority]) => {
    const [minter] = await findMinterAddress(mintWrapper, authority);
    return minter;
  },
  [ProgramAddressType.QUARRY_REGISTRY]: async ([rewarder]) => {
    const [registry] = await findRegistryAddress(rewarder);
    return registry;
  },
};

const associationCache: Record<string, PublicKey> = {};

export type ProgramAddressInputPaths = {
  [ProgramAddressType.ATA]: readonly [token: PublicKey, owner: PublicKey];
  [ProgramAddressType.MINE_REWARDER]: readonly [base: PublicKey];
  [ProgramAddressType.MINE_QUARRY]: readonly [
    rewarder: PublicKey,
    tokenMint: PublicKey
  ];
  [ProgramAddressType.MINE_MINER]: readonly [
    rewarder: PublicKey,
    tokenMint: PublicKey,
    owner: PublicKey
  ];

  [ProgramAddressType.MW_MINTER]: readonly [
    mintWrapper: PublicKey,
    authority: PublicKey
  ];
  [ProgramAddressType.QUARRY_REGISTRY]: readonly [rewarder: PublicKey];
};

export type ProgramAddressInput<
  K extends ProgramAddressType = ProgramAddressType
> = {
  type: K;
  path: ProgramAddressInputPaths[K];
};

const makeCacheKey = ({ type, path }: ProgramAddressInput): string =>
  `${type}/${path.map((p) => p.toString()).join(",")}`;

/**
 * Loads and caches program addresses.
 * @param addresses
 * @returns
 */
export const useProgramAddresses = (
  addresses: (ProgramAddressInput | null)[]
): (PublicKey | null)[] => {
  const [keys, setKeys] = useState<(PublicKey | null)[]>(
    addresses.map((addr) => {
      if (!addr) {
        return null;
      }
      const cacheKey = makeCacheKey(addr);
      if (associationCache[cacheKey]) {
        return associationCache[cacheKey] ?? null;
      }
      return null;
    })
  );

  useEffect(() => {
    void (async () => {
      setKeys(
        await Promise.all(
          addresses.map(
            async <K extends ProgramAddressType>(
              addr: ProgramAddressInput<K> | null
            ): Promise<PublicKey | null> => {
              if (!addr) {
                return null;
              }
              const cacheKey = makeCacheKey(addr);
              if (associationCache[cacheKey]) {
                return associationCache[cacheKey] ?? null;
              }
              const strategy = strategies[addr.type] as (
                path: ProgramAddressInputPaths[K]
              ) => Promise<PublicKey>;
              const nextKey = await strategy(addr.path);
              associationCache[cacheKey] = nextKey;
              return nextKey;
            }
          )
        )
      );
    })();
  }, [addresses]);

  return keys;
};
