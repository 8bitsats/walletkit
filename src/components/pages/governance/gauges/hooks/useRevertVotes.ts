import { GaugeSDK } from "@quarryprotocol/gauge";
import { useSail } from "@saberhq/sail";
import type { TransactionEnvelope } from "@saberhq/solana-contrib";
import { useCallback } from "react";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../../contexts/sdk";
import { useGaugemeister } from "./useGaugemeister";
import { useAllGauges } from "./useGauges";

export const useRevertVotes = () => {
  const { gaugeKeys } = useAllGauges();
  const { sdkMut } = useSDK();
  const { handleTXs } = useSail();
  const gaugemeister = useGaugemeister();
  return useCallback(async () => {
    invariant(sdkMut && gaugemeister && gaugeKeys);
    const gauge = GaugeSDK.load({ provider: sdkMut.provider });

    // revert the votes
    const revertTXs = await gauge.gauge.revertVotes({
      gaugemeister,
      gauges: gaugeKeys,
    });
    const { pending, success } = await handleTXs(
      revertTXs.filter((txEnv): txEnv is TransactionEnvelope => !!txEnv),
      "Revert votes"
    );
    if (!success) {
      throw new Error("Could not revert votes");
    }
    return await Promise.all(pending.map((p) => p.wait()));
  }, [gaugeKeys, gaugemeister, handleTXs, sdkMut]);
};
