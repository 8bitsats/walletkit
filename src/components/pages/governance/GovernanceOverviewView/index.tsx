import { GovernancePage } from "../../../common/governance/GovernancePage";
import { TokenIcon } from "../../../common/TokenIcon";
import { useGovernor, useGovWindowTitle } from "../hooks/useGovernor";
import { OverviewHeader } from "./OverviewHeader";
import { RecentProposals } from "./RecentProposals";

export const GovernanceOverviewView: React.FC = () => {
  useGovWindowTitle(`Overview`);
  const { govToken, daoName } = useGovernor();
  return (
    <GovernancePage
      title={
        <div tw="flex items-center gap-2">
          <TokenIcon token={govToken} size={36} />
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
