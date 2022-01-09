import {
  findEpochGaugeVoterAddress,
  findGaugeAddress,
  findGaugeVoterAddress,
  GaugeSDK,
} from "@quarryprotocol/gauge";
import { useRewarder } from "@quarryprotocol/react-quarry";
import { TransactionEnvelope } from "@saberhq/solana-contrib";
import { findEscrowAddress } from "@tribecahq/tribeca-sdk";
import { chunk } from "lodash";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../../contexts/sdk";
import { AttributeList } from "../../../../common/AttributeList";
import { useModal } from "../../../../common/Modal/context";
import { ModalInner } from "../../../../common/Modal/ModalInner";
import { TransactionPlanExecutor } from "../../../../common/TransactionPlanExecutor";
import type { TransactionPlan } from "../../../../common/TransactionPlanExecutor/plan";
import { useGaugemeister } from "../hooks/useGaugemeister";
import { useAllGauges } from "../hooks/useGauges";
import { useUpdateGaugeWeights } from "./useUpdateGaugeWeights";

export const SetWeightsModal: React.FC = () => {
  const gaugemeister = useGaugemeister();
  const { sdkMut } = useSDK();
  const { rewarderKey } = useRewarder();
  const { sharesDiff, escrowKey } = useUpdateGaugeWeights();
  const { gaugeKeys } = useAllGauges();
  const { close } = useModal();

  const makePlan = async () => {
    const plan: TransactionPlan = { steps: [] };

    invariant(sdkMut, "sdk missing");
    invariant(rewarderKey, "rewarder key");
    invariant(escrowKey, "escrow key");
    invariant(gaugemeister && gaugeKeys, "gaugemeister");

    const gauge = GaugeSDK.load({ provider: sdkMut.provider });
    const [gaugeVoterKey] = await findGaugeVoterAddress(
      gaugemeister,
      escrowKey
    );
    const gv = await gauge.gauge.fetchGaugeVoter(gaugeVoterKey);
    if (!gv) {
      const { tx: createGVTX } = await gauge.gauge.createGaugeVoter({
        gaugemeister,
        escrow: escrowKey,
      });
      plan.steps.push({
        title: "Setup Gauge Voting",
        txs: [createGVTX],
      });
    }

    const shareUpdates = await Promise.all(
      sharesDiff.map(async (diff) => {
        invariant(diff.nextShareParsed !== null, "next share parsed");
        const [gaugeKey] = await findGaugeAddress(
          gaugemeister,
          diff.quarry.accountId
        );
        const setVoteTX = await gauge.gauge.setVote({
          gauge: gaugeKey,
          weight: diff.nextShareParsed,
        });
        return setVoteTX;
      })
    );

    if (shareUpdates.length > 0) {
      plan.steps.push({
        title: "Update Shares",
        txs: chunk(shareUpdates, 10).map((c) =>
          TransactionEnvelope.combineAll(...c)
        ),
      });
    }

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
        const revertTXs = await gauge.gauge.revertVotes({
          gaugemeister,
          gauges: gaugeKeys,
        });
        plan.steps.push({
          title: "Revert Votes",
          txs: revertTXs.filter(
            (txEnv): txEnv is TransactionEnvelope => !!txEnv
          ),
        });
      }
      plan.steps.push({
        title: "Reset committed votes",
        txs: [
          await gauge.gauge.resetEpochGaugeVoter({
            gaugemeister,
          }),
        ],
      });
    } else {
      plan.steps.push({
        txs: [
          await gauge.gauge.prepareEpochGaugeVoter({
            gaugemeister,
          }),
        ],
        title: "Prepare votes",
      });
    }

    const voteTXs = await gauge.gauge.commitVotes({
      gaugemeister,
      gauges: gaugeKeys,
    });
    plan.steps.push({
      txs: voteTXs.filter((txEnv): txEnv is TransactionEnvelope => !!txEnv),
      title: "Commit votes",
    });

    return plan;
  };

  return (
    <ModalInner title="Update Gauge Weights">
      <div tw="mb-4">
        <AttributeList
          attributes={sharesDiff.reduce(
            (acc, el) => ({
              ...acc,
              [el.quarryInfo.stakedToken.name]: `${
                el.prevShareParsed ?? "(null)"
              } -> ${el.nextShareParsed ?? "(null)"}`,
            }),
            {}
          )}
        />
      </div>
      <TransactionPlanExecutor makePlan={makePlan} onComplete={close} />
    </ModalInner>
  );
};
