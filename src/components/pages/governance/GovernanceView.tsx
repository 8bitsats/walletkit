import { GovernorLayout } from "../../layout/GovernorLayout";
import { GovernorProvider } from "./hooks/useGovernor";
import { GovernanceRoutes } from "./routes";

export const GovernanceView: React.FC = () => {
  return (
    <GovernorProvider>
      <GovernorLayout>
        <GovernanceRoutes />
      </GovernorLayout>
    </GovernorProvider>
  );
};
