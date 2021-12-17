import { GovernancePage } from "../../../common/governance/GovernancePage";
import { useGovWindowTitle } from "../hooks/useGovernor";
import { ExecutiveCouncilInfo } from "./ExecutiveCouncilInfo";
import { GovernorInfo } from "./GovernorInfo";
import { LockerInfo } from "./LockerInfo";

export const GovernanceDetailsView: React.FC = () => {
  useGovWindowTitle(`Details`);
  return (
    <GovernancePage title="Governance Details">
      <div tw="grid md:grid-cols-2 gap-4">
        <GovernorInfo />
        <LockerInfo />
        <ExecutiveCouncilInfo />
      </div>
    </GovernancePage>
  );
};
