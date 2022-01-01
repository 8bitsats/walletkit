import { LoadingPage } from "../../common/LoadingPage";
import { GovernorLayout } from "../../layout/GovernorLayout";
import { GovernanceNotFoundPage } from "./GovernanceNotFoundPage";
import { GovernorProvider, useGovernorInfo } from "./hooks/useGovernor";
import { GovernanceRoutes } from "./routes";

export const GovernanceView: React.FC = () => {
  const info = useGovernorInfo();
  if (info?.loading) {
    return <LoadingPage />;
  }
  if (!info) {
    return (
      <GovernorLayout>
        <GovernanceNotFoundPage />
      </GovernorLayout>
    );
  }

  return (
    <GovernorProvider>
      <GovernorLayout>
        <GovernanceRoutes />
      </GovernorLayout>
    </GovernorProvider>
  );
};
