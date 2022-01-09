import { RewarderProvider } from "@quarryprotocol/react-quarry";

import { useParsedGaugemeister } from "../../../../../../utils/parsers";
import { Card } from "../../../../../common/governance/Card";
import { useGaugemeister } from "../../hooks/useGaugemeister";
import { GaugeSelector } from "./GaugeSelector";

export const AddGaugeCard: React.FC = () => {
  const gaugemeister = useGaugemeister();
  const gm = useParsedGaugemeister(gaugemeister);

  const rewarderKey = gm.data?.accountInfo.data.rewarder;

  return (
    <Card title="All Gauges">
      {rewarderKey && (
        <RewarderProvider initialState={{ rewarderKey }}>
          <GaugeSelector />
        </RewarderProvider>
      )}
    </Card>
  );
};
