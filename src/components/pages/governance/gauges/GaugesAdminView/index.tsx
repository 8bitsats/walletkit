import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { useGovWindowTitle } from "../../hooks/useGovernor";
import { AddGaugeCard } from "./AddGaugeCard";

export const GaugesAdminView: React.FC = () => {
  useGovWindowTitle(`Gauges Admin`);
  return (
    <GovernancePage title="Gauges Admin">
      <div tw="flex flex-col gap-4">
        <AddGaugeCard />
      </div>
    </GovernancePage>
  );
};
