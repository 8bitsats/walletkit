import type { QuarryData } from "@quarryprotocol/quarry-sdk";
import type { QuarryInfo } from "@quarryprotocol/react-quarry";
import { useRewarder } from "@quarryprotocol/react-quarry";
import type { ParsedAccountInfo } from "@saberhq/sail";
import type { Token } from "@saberhq/token-utils";
import { PublicKey } from "@solana/web3.js";
import { mapValues } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { createContainer } from "unstated-next";

import { useUserEscrow } from "../../hooks/useEscrow";
import { useAllGauges } from "../hooks/useGauges";
import { useMyGauges } from "../hooks/useMyGauges";

interface ShareDiff {
  quarryInfo: QuarryInfo;
  quarry: ParsedAccountInfo<QuarryData>;
  prevShare?: string;
  nextShare?: string;

  prevShareParsed: number;
  nextShareParsed: number | null;
}

const useUpdateGaugeWeightsInternal = (): {
  /**
   * Next shares of each token mint, parsed.
   */
  nextShares: Record<string, number | null>;
  /**
   * Next shares of each token mint.
   */
  nextSharesRaw: Record<
    string,
    {
      currentShare: number;
      value: string;
    }
  >;
  /**
   * Sets the share of a token by its mint.
   */
  setTokenShareStr: (
    tokenMint: Token,
    currentShare: number,
    value: string
  ) => void;

  sharesDiff: ShareDiff[];
  /**
   * True if the shares diff is valid and can be applied.
   */
  isDiffValid: boolean;

  currentTotalShares: number;
  nextTotalShares: number | null;
  escrowKey: PublicKey | undefined;
  gaugeKeys: PublicKey[];
} => {
  const { quarries } = useRewarder();
  const { gaugeVoter } = useMyGauges();
  const { escrowKey } = useUserEscrow();
  const { gaugeKeys } = useAllGauges();

  const [nextSharesRaw, setNextSharesRaw] = useState<
    Record<string, { currentShare: number; value: string }>
  >({});

  const setTokenShareStr = useCallback(
    (farmKey: Token, currentShare: number, value: string) => {
      setNextSharesRaw((subs) => ({
        ...subs,
        [farmKey.address]: { currentShare, value },
      }));
    },
    []
  );

  const sharesDiff: ShareDiff[] = useMemo(() => {
    return Object.entries(nextSharesRaw)
      .map(
        ([
          stakedTokenMintStr,
          { currentShare: prevShare, value: nextShare },
        ]): ShareDiff | null => {
          const quarryInfo = quarries.find((quarry) =>
            quarry.stakedToken.mintAccount.equals(
              new PublicKey(stakedTokenMintStr)
            )
          );
          const quarry = quarryInfo?.quarry;
          if (!quarry || !quarryInfo) {
            return null;
          }

          if (prevShare.toString() !== nextShare) {
            const prevShareParsed: number = prevShare;
            let nextShareParsed: number | null = null;
            try {
              nextShareParsed = nextShare === "" ? 0 : parseInt(nextShare);
              // eslint-disable-next-line no-empty
            } catch (e) {}

            return {
              quarryInfo,
              quarry,
              prevShare: prevShare.toString(),
              nextShare,

              prevShareParsed,
              nextShareParsed,
            };
          }

          return null;
        }
      )
      .filter((x): x is ShareDiff => !!x);
  }, [nextSharesRaw, quarries]);

  const isDiffValid = useMemo(() => {
    return !sharesDiff.find((diff) => !diff.nextShare);
  }, [sharesDiff]);

  const currentTotalShares = gaugeVoter?.accountInfo.data.totalWeight ?? 0;
  const nextTotalShares = useMemo(() => {
    return sharesDiff.reduce((acc, diff) => {
      if (diff.nextShareParsed !== null) {
        return acc + diff.nextShareParsed - diff.prevShareParsed;
      }
      return acc;
    }, currentTotalShares);
  }, [currentTotalShares, sharesDiff]);

  const nextShares = useMemo(() => {
    return mapValues(nextSharesRaw, (amt) => {
      try {
        const parsedAmt = parseInt(amt.value);
        if (Number.isNaN(parsedAmt)) {
          return null;
        }
        return parsedAmt;
      } catch (e) {
        return null;
      }
    });
  }, [nextSharesRaw]);

  return {
    nextShares,
    nextSharesRaw,
    setTokenShareStr,

    sharesDiff,
    isDiffValid,

    currentTotalShares,
    nextTotalShares,
    escrowKey,
    gaugeKeys: gaugeKeys ?? [],
  };
};

export const {
  useContainer: useUpdateGaugeWeights,
  Provider: UpdateGaugeWeightsProvider,
} = createContainer(useUpdateGaugeWeightsInternal);
