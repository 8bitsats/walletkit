import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { useGovWindowTitle } from "../../hooks/useGovernor";
import { SetupGaugesCard } from "./SetupGaugesCard";

export const GaugesSetupView: React.FC = () => {
  useGovWindowTitle(`Setup Gauges`);
  return (
    <GovernancePage title="Setup Gauges">
      <div tw="flex flex-col gap-4">
        <SetupGaugesCard />
      </div>
    </GovernancePage>
  );
};
