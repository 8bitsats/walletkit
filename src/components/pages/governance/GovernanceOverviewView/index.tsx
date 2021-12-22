import { GovernancePage } from "../../../common/governance/GovernancePage";
import { ImageWithFallback } from "../../../common/ImageWithFallback";
import { useGovernor, useGovWindowTitle } from "../hooks/useGovernor";
import { OverviewHeader } from "./OverviewHeader";
import { RecentProposals } from "./RecentProposals";

export const GovernanceOverviewView: React.FC = () => {
  useGovWindowTitle(`Overview`);
  const { daoName, iconURL } = useGovernor();
  return (
    <GovernancePage
      title={
        <div tw="flex items-center gap-2">
          <ImageWithFallback
            src={iconURL}
            size={36}
            alt={`Icon for ${daoName ?? "DAO"}`}
          />
          <span>{daoName} Governance</span>
        </div>
      }
      preContent={<OverviewHeader />}
      hideDAOName={true}
    >
      <RecentProposals />
    </GovernancePage>
  );
};
