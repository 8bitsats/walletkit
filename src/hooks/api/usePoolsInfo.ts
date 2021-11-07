import type {
  StableSwapConfig,
  StableSwapState,
  SwapTokenInfo,
} from "@saberhq/stableswap-sdk";
import { u64 } from "@saberhq/token-utils";
import { useConnectionContext } from "@saberhq/use-solana";
import * as Sentry from "@sentry/react";
import type { TokenInfo } from "@solana/spl-token-registry";
import { PublicKey } from "@solana/web3.js";
import { mapValues } from "lodash";
import { useMemo } from "react";

import type { CurrencyMarket } from "../../utils/currencies";
import poolsInfoDevnet from "./data/pools-info.devnet.json";
import poolsInfoMainnet from "./data/pools-info.mainnet.json";

export const POOL_TAGS = {
  "wormhole-v1": "Contains a Wormhole V1 asset.",
  "wormhole-v2": "Contains a Wormhole V2 asset.",
};
export type PoolTag = keyof typeof POOL_TAGS;

export interface PoolInfo {
  id: string;
  name: string;
  tokens: readonly [TokenInfo, TokenInfo];
  tokenIcons: readonly [TokenInfo, TokenInfo];
  underlyingIcons: readonly [TokenInfo, TokenInfo];
  currency: CurrencyMarket;
  lpToken: TokenInfo;

  plotKey: PublicKey;
  swap: {
    config: StableSwapConfig;
    state: StableSwapState;
  };
  hidden?: boolean;
  newPoolID?: string;
  tags?: readonly PoolTag[];
}

export interface PoolsInfoData {
  addresses: {
    landlord: PublicKey;
    landlordBase: PublicKey;
  };
  pools: PoolInfo[];
}

type PoolInfoRaw = Omit<PoolInfo, "swap"> & {
  swap: {
    config: {
      swapAccount: string;
      authority: string;
      swapProgramID: string;
      tokenProgramID: string;
    };
    state: StableSwapStateRaw;
  };
  hidden?: boolean;
};

type SwapTokenInfoRaw = {
  [K in keyof SwapTokenInfo]: string;
};

type StableSwapStateRaw = {
  [K in keyof StableSwapState]: StableSwapState[K] extends PublicKey | u64
    ? string
    : StableSwapState[K] extends SwapTokenInfo
    ? SwapTokenInfoRaw
    : StableSwapState[K];
};

const parseRawSwapState = (state: StableSwapStateRaw): StableSwapState => {
  return {
    ...state,
    futureAdminAccount: new PublicKey(state.futureAdminAccount),
    poolTokenMint: new PublicKey(state.poolTokenMint),
    adminAccount: new PublicKey(state.adminAccount),

    tokenA: valuesToKeys(state.tokenA),
    tokenB: valuesToKeys(state.tokenB),

    isPaused: !!state.isPaused,
    initialAmpFactor: new u64(state.initialAmpFactor, "hex"),
    targetAmpFactor: new u64(state.targetAmpFactor, "hex"),
    startRampTimestamp: state.startRampTimestamp,
    stopRampTimestamp: state.stopRampTimestamp,

    fees: state.fees,
  };
};

/**
 * Use pools info from the API.
 * @returns
 */
export const usePoolsInfo = (): {
  loading: boolean;
  data: PoolsInfoData | null | undefined;
} => {
  const { network } = useConnectionContext();
  const data =
    network === "mainnet-beta"
      ? poolsInfoMainnet
      : network === "devnet"
      ? poolsInfoDevnet
      : null;
  if (data === null) {
    Sentry.captureException(new Error(`Invalid network ${network}`));
  }

  const dataParsed = useMemo(() => {
    if (!data) {
      return data;
    }
    return {
      addresses: valuesToKeys(data.addresses),
      pools: data.pools.map((poolRaw: unknown) => {
        const pool = poolRaw as PoolInfoRaw;
        return {
          ...pool,
          swap: {
            config: valuesToKeys(pool.swap.config),
            state: parseRawSwapState(pool.swap.state),
          },
        };
      }),
    };
  }, [data]);

  return {
    loading: data === undefined,
    data: dataParsed,
  };
};

const valuesToKeys = <T extends Record<string, string>>(
  raw: T
): { [K in keyof T]: PublicKey } =>
  mapValues(raw, (addr) => new PublicKey(addr));
