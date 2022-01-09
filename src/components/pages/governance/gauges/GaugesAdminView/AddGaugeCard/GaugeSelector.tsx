import { useRewarder } from "@quarryprotocol/react-quarry";

import { TableCardBody } from "../../../../../common/card/TableCardBody";
import { GaugeInfo } from "./GaugeInfo";

export const GaugeSelector: React.FC = () => {
  const { quarries } = useRewarder();
  return (
    <TableCardBody>
      {quarries.map((quarry) => (
        <GaugeInfo key={quarry.key.toString()} quarry={quarry} />
      ))}
    </TableCardBody>
  );
};
