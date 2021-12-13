import { GovernancePage } from "../../../common/governance/GovernancePage";
import { GovernorInfo } from "./GovernorInfo";
import { LockerInfo } from "./LockerInfo";

export const GovernanceDetailsView: React.FC = () => {
  return (
    <GovernancePage title="Governance Details">
      <div tw="grid grid-cols-2 gap-4">
        <GovernorInfo />
        <LockerInfo />
      </div>
    </GovernancePage>
  );
};
