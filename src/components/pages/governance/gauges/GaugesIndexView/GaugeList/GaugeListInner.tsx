import { findEpochGaugeAddress } from "@quarryprotocol/gauge";
import { useRewarder } from "@quarryprotocol/react-quarry";
import BN from "bn.js";
import { useMemo } from "react";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";

import { useParsedEpochGauges } from "../../../../../../utils/parsers";
import { TableCardBody } from "../../../../../common/card/TableCardBody";
import { useGaugemeister, useGMData } from "../../hooks/useGaugemeister";
import { useAllGauges } from "../../hooks/useGauges";
import { GaugeListRow } from "./GaugeListRow";

export const GaugeListInner: React.FC = () => {
  const { quarries, rewarder } = useRewarder();
  const { gauges, gaugeKeys } = useAllGauges();
  const gaugemeister = useGaugemeister();
  const { data: gmData } = useGMData();

  const votingEpoch = gmData
    ? gmData.accountInfo.data.currentRewardsEpoch + 1
    : null;

  const { data: epochGaugeKeys } = useQuery(
    ["epochGaugeKeys", gaugemeister?.toString(), votingEpoch],
    async () => {
      invariant(gaugemeister && gaugeKeys && votingEpoch !== null);
      return await Promise.all(
        gaugeKeys.map(async (gaugeKey) => {
          const [key] = await findEpochGaugeAddress(gaugeKey, votingEpoch);
          return key;
        })
      );
    },
    {
      enabled: !!gaugemeister && !!gaugeKeys && votingEpoch !== null,
    }
  );
  const epochGauges = useParsedEpochGauges(
    useMemo(() => epochGaugeKeys ?? [], [epochGaugeKeys])
  );
  const totalShares = epochGauges.every((eg) => eg !== undefined)
    ? epochGauges

        .map((eg) => eg?.accountInfo.data.totalPower ?? new BN(0))
        .reduce((acc, n) => acc.add(n), new BN(0))
    : null;

  return (
    <TableCardBody
      head={
        <tr>
          <th>Gauge</th>
          <th>Current Share</th>
          <th>Next Share</th>
        </tr>
      }
    >
      {quarries.map((quarry) => {
        const gauge = gauges.find((g) =>
          g?.accountInfo.data.quarry.equals(quarry.key)
        );
        if (!gauge) {
          return null;
        }
        return (
          <GaugeListRow
            key={quarry.key.toString()}
            quarry={quarry}
            gauge={gauge}
            totalShares={totalShares}
            dailyRewardsRate={
              rewarder
                ? rewarder.accountInfo.data.annualRewardsRate.div(new BN(365))
                : rewarder
            }
          />
        );
      })}
    </TableCardBody>
  );
};
