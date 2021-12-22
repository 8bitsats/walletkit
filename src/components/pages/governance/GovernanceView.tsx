import { LoadingPage } from "../../common/LoadingPage";
import { GovernorLayout } from "../../layout/GovernorLayout";
import { GovernorProvider, useGovernorInfo } from "./hooks/useGovernor";
import { GovernanceRoutes } from "./routes";

export const GovernanceView: React.FC = () => {
  const info = useGovernorInfo();
  if (!info) {
    return <LoadingPage />;
  }

  return (
    <GovernorProvider>
      <GovernorLayout>
        <GovernanceRoutes />
      </GovernorLayout>
    </GovernorProvider>
  );
};
