import {
  findGaugeAddress,
  findGaugeVoterAddress,
  GaugeSDK,
} from "@quarryprotocol/gauge";
import { useRewarder } from "@quarryprotocol/react-quarry";
import { useSail } from "@saberhq/sail";
import { TransactionEnvelope } from "@saberhq/solana-contrib";
import { chunk } from "lodash";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../../contexts/sdk";
import { AttributeList } from "../../../../common/AttributeList";
import { useModal } from "../../../../common/Modal/context";
import { ModalInner } from "../../../../common/Modal/ModalInner";
import { useCommitVotes } from "../hooks/useCommitVotes";
import { useGaugemeister } from "../hooks/useGaugemeister";
import { useRevertVotes } from "../hooks/useRevertVotes";
import { useUpdateGaugeWeights } from "./useUpdateGaugeWeights";

export const SetWeightsModal: React.FC = () => {
  const gaugemeister = useGaugemeister();
  const { sdkMut } = useSDK();
  const { handleTXs, handleTX } = useSail();
  const { rewarderKey } = useRewarder();
  const { sharesDiff, escrowKey } = useUpdateGaugeWeights();
  const revertVotes = useRevertVotes();
  const commitVotes = useCommitVotes();
  const { close } = useModal();

  return (
    <ModalInner
      title="Update Gauge Weights"
      buttonProps={{
        onClick: async () => {
          invariant(sdkMut, "sdk missing");
          invariant(rewarderKey, "rewarder key");
          invariant(escrowKey, "escrow key");
          invariant(gaugemeister, "gaugemeister");

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
            const { pending, success } = await handleTX(
              createGVTX,
              "Setup Gauge Voting"
            );
            if (!pending || !success) {
              return;
            }
            await pending.wait();
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

          const result = await handleTXs(
            chunk(shareUpdates, 10).map((c) =>
              TransactionEnvelope.combineAll(...c)
            ),
            `Update Shares`
          );
          await Promise.all(result.pending.map((p) => p.wait()));

          await revertVotes();
          await commitVotes();
          close();
        },
        children: "Update Gauge Weights",
      }}
    >
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
    </ModalInner>
  );
};
