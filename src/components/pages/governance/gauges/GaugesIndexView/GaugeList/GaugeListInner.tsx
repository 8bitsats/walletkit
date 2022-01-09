import { useRewarder } from "@quarryprotocol/react-quarry";

import { TableCardBody } from "../../../../../common/card/TableCardBody";
import { useAllGauges } from "../../hooks/useGauges";
import { GaugeListRow } from "./GaugeListRow";

export const GaugeListInner: React.FC = () => {
  const { quarries } = useRewarder();
  const { gauges } = useAllGauges();

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
          />
        );
      })}
    </TableCardBody>
  );
};
