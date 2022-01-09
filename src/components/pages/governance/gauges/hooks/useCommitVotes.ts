import {
  findEpochGaugeVoterAddress,
  findGaugeVoterAddress,
  GaugeSDK,
} from "@quarryprotocol/gauge";
import { useSail } from "@saberhq/sail";
import type { TransactionEnvelope } from "@saberhq/solana-contrib";
import { findEscrowAddress } from "@tribecahq/tribeca-sdk";
import { useCallback } from "react";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../../contexts/sdk";
import { useGaugemeister } from "./useGaugemeister";
import { useAllGauges } from "./useGauges";

export const useCommitVotes = () => {
  const { gaugeKeys } = useAllGauges();
  const { sdkMut } = useSDK();
  const { handleTX, handleTXs } = useSail();
  const gaugemeister = useGaugemeister();
  return useCallback(async () => {
    invariant(sdkMut && gaugemeister && gaugeKeys);
    const gauge = GaugeSDK.load({ provider: sdkMut.provider });

    const gmData = await gauge.gauge.fetchGaugemeister(gaugemeister);
    if (!gmData) {
      throw new Error("gaugemeister not found");
    }
    const [escrow] = await findEscrowAddress(
      gmData.locker,
      sdkMut.provider.wallet.publicKey
    );
    const [gaugeVoter] = await findGaugeVoterAddress(gaugemeister, escrow);
    const [epochGaugeVoter] = await findEpochGaugeVoterAddress(
      gaugeVoter,
      gmData.currentRewardsEpoch + 1
    );
    const epochGaugeVoterData = await gauge.gauge.fetchEpochGaugeVoter(
      epochGaugeVoter
    );
    if (epochGaugeVoterData) {
      if (!epochGaugeVoterData.allocatedPower.isZero()) {
        throw new Error("Must reset epoch votes first.");
      } else {
        const { pending, success } = await handleTX(
          await gauge.gauge.resetEpochGaugeVoter({
            gaugemeister,
          }),
          "Reset committed votes"
        );
        if (!success || !pending) {
          return;
        }
        await pending.wait();
      }
    } else {
      const { pending, success } = await handleTX(
        await gauge.gauge.prepareEpochGaugeVoter({
          gaugemeister,
        }),
        "Prepare votes"
      );
      if (!success || !pending) {
        return;
      }
      await pending.wait();
    }

    // commit the votes
    const voteTXs = await gauge.gauge.commitVotes({
      gaugemeister,
      gauges: gaugeKeys,
    });
    const { pending, success } = await handleTXs(
      voteTXs.filter((txEnv): txEnv is TransactionEnvelope => !!txEnv),
      "Commit votes"
    );
    if (!success) {
      return;
    }
    await Promise.all(pending.map((p) => p.wait()));
  }, [gaugeKeys, gaugemeister, handleTX, handleTXs, sdkMut]);
};
