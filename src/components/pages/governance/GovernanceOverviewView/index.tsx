import { Card } from "../../../common/governance/Card";
import { GovernancePage } from "../../../common/governance/GovernancePage";
import { ImageWithFallback } from "../../../common/ImageWithFallback";
import { useGovernor, useGovWindowTitle } from "../hooks/useGovernor";
import { ProgramsList } from "../ProgramsView/ProgramsList";
import { OverviewHeader } from "./OverviewHeader";
import { RecentProposals } from "./RecentProposals";

export const GovernanceOverviewView: React.FC = () => {
  useGovWindowTitle(`Overview`);
  const { daoName, iconURL, path } = useGovernor();
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
      <Card
        tw="mt-8"
        title="Programs"
        link={{
          title: "View all programs",
          href: `${path}/programs`,
        }}
      >
        <ProgramsList maxCount={3} />
      </Card>
    </GovernancePage>
  );
};
