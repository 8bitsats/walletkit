import { LoadingPage } from "../../common/LoadingPage";
import { NotFoundPage } from "../../common/NotFoundPage";
import { GovernorLayout } from "../../layout/GovernorLayout";
import { GovernorProvider, useGovernorInfo } from "./hooks/useGovernor";
import { GovernanceRoutes } from "./routes";

export const GovernanceView: React.FC = () => {
  const info = useGovernorInfo();
  if (info?.loading) {
    return <LoadingPage />;
  }
  if (!info) {
    return <NotFoundPage />;
  }

  return (
    <GovernorProvider>
      <GovernorLayout>
        <GovernanceRoutes />
      </GovernorLayout>
    </GovernorProvider>
  );
};
