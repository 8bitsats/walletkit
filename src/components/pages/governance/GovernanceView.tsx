import { GovernorLayout } from "../../layout/GovernorLayout";
import { GovernanceRoutes } from "./routes";

export const GovernanceView: React.FC = () => {
  return (
    <GovernorLayout>
      <GovernanceRoutes />
    </GovernorLayout>
  );
};
