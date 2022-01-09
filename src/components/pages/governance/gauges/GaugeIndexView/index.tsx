import { usePubkey } from "@saberhq/sail";
import { useParams } from "react-router-dom";

import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { useGovWindowTitle } from "../../hooks/useGovernor";
import { useGauge } from "../hooks/useGauges";

export const GaugesIndexView: React.FC = () => {
  const { stakedMint: stakedMintStr } = useParams<{ stakedMint: string }>();
  const { token } = useGauge(usePubkey(stakedMintStr));
  useGovWindowTitle(`Gauge - ${token?.name ?? ""}`);
  return (
    <GovernancePage title="Gauge">
      <div tw="flex flex-wrap md:flex-nowrap gap-4 items-start"></div>
    </GovernancePage>
  );
};
