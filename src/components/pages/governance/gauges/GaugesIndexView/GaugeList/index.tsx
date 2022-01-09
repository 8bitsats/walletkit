import { RewarderProvider } from "@quarryprotocol/react-quarry";

import { useParsedGaugemeister } from "../../../../../../utils/parsers";
import { useGaugemeister } from "../../hooks/useGaugemeister";
import { GaugeListInner } from "./GaugeListInner";

export const GaugeList: React.FC = () => {
  const gaugemeister = useGaugemeister();
  const gm = useParsedGaugemeister(gaugemeister);
  const rewarderKey = gm.data?.accountInfo.data.rewarder;

  return (
    <>
      {rewarderKey && (
        <RewarderProvider initialState={{ rewarderKey }}>
          <GaugeListInner />
        </RewarderProvider>
      )}
    </>
  );
};
