import type { GaugeData } from "@quarryprotocol/gauge";
import { findEpochGaugeAddress, GaugeSDK } from "@quarryprotocol/gauge";
import type { QuarryData } from "@quarryprotocol/quarry-sdk";
import { QuarrySDK } from "@quarryprotocol/quarry-sdk";
import { useSail } from "@saberhq/sail";
import type { TransactionEnvelope } from "@saberhq/solana-contrib";
import { chunk } from "lodash";
import invariant from "tiny-invariant";
import tw from "twin.macro";

import { useSDK } from "../../../../../contexts/sdk";
import { useParsedGaugemeister } from "../../../../../utils/parsers";
import { Button } from "../../../../common/Button";
import { Card } from "../../../../common/governance/Card";
import { useGaugemeister } from "../hooks/useGaugemeister";
import { useAllGauges } from "../hooks/useGauges";
import { GaugeList } from "./GaugeList";

/**
 * TODO: add a tree map of all gauges.
 * @returns
 */
export const AllGauges: React.FC = () => {
  const gaugemeister = useGaugemeister();
  const { data: gm } = useParsedGaugemeister(gaugemeister);

  const { gaugeKeys } = useAllGauges();
  const { sdkMut } = useSDK();
  const { handleTXs } = useSail();
  const syncGauges = async () => {
    invariant(sdkMut && gm && gaugeKeys);
    const gaugeSDK = GaugeSDK.load({ provider: sdkMut.provider });

    const gaugeData: (GaugeData | null)[] =
      (await gaugeSDK.programs.Gauge.account.gauge.fetchMultiple(
        gaugeKeys
      )) as (GaugeData | null)[];

    const gmData = await gaugeSDK.gauge.fetchGaugemeister(gm.accountId);
    if (!gmData) {
      throw new Error("gaugemeister data not found");
    }
    const syncTXs = await Promise.all(
      gaugeKeys.map(async (gauge, i) => {
        if (!gaugeData[i]) {
          return null;
        }
        const [epochGauge] = await findEpochGaugeAddress(
          gauge,
          gmData.currentRewardsEpoch
        );
        // skip over null epochs
        if (!(await gaugeSDK.provider.connection.getAccountInfo(epochGauge))) {
          return null;
        }
        return await gaugeSDK.gauge.syncGauge({ gauge });
      }) ?? []
    );
    const { pending, success } = await handleTXs(
      syncTXs.filter((tx): tx is TransactionEnvelope => !!tx),
      "Sync Gauges"
    );
    await Promise.all(pending.map((p) => p.wait()));
    if (!success) {
      return;
    }

    const quarrySDK = QuarrySDK.load({ provider: sdkMut.provider });
    const rewarderW = await quarrySDK.mine.loadRewarderWrapper(
      gm.accountInfo.data.rewarder
    );

    const quarryData: QuarryData[] =
      (await quarrySDK.programs.Mine.account.quarry.fetchMultiple(
        gaugeData.filter((g): g is GaugeData => !!g).map((g) => g.quarry)
      )) as QuarryData[];

    const quarrySyncTXs = await Promise.all(
      chunk(
        quarryData.map((q) => q.tokenMintKey),
        10
      ).map(async (mints) => {
        return await rewarderW.syncQuarryRewards(mints);
      })
    );
    await handleTXs(quarrySyncTXs, "Sync Quarries");
  };

  return (
    <Card
      titleStyles={tw`flex items-center justify-between`}
      title={
        <>
          <span>All Gauges</span>
          <Button variant="outline" onClick={syncGauges}>
            Sync
          </Button>
        </>
      }
    >
      <div tw="whitespace-nowrap overflow-x-auto">
        <GaugeList />
      </div>
    </Card>
  );
};
