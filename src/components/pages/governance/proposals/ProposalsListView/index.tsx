import { Switch } from "@headlessui/react";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import tw from "twin.macro";

import { Card } from "../../../../common/governance/Card";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { ProposalsList } from "../../GovernanceOverviewView/ProposalsList";
import { ProposalBadgeWrapper } from "../../GovernanceOverviewView/ProposalsList/ProposalCard";
import { useGovernor, useGovWindowTitle } from "../../hooks/useGovernor";
import { LegendsNeverDie } from "./LegendsNeverDie";

export const ProposalsListView: React.FC = () => {
  const { path } = useGovernor();
  const [showDrafts, setShowDrafts] = useState<boolean>(false);
  useGovWindowTitle(`Proposals`);

  return (
    <GovernancePage title="Governance Proposals" right={<LegendsNeverDie />}>
      <Card
        title={
          <div tw="flex w-full items-center justify-between">
            <div tw="flex items-center gap-4">
              <h2>All Proposals</h2>
              <Link
                to={`${path}/proposals/create`}
                tw="pt-0.5 flex items-center text-primary hover:text-white transition-all"
              >
                <button>
                  <FaPlusCircle />
                </button>
              </Link>
            </div>
            <ProposalBadgeWrapper tw="flex gap-4 w-auto">
              <Switch.Group>
                <div tw="flex items-center text-sm">
                  <Switch
                    checked={showDrafts}
                    onChange={setShowDrafts}
                    css={[
                      showDrafts ? tw`bg-primary` : tw`bg-warmGray-600`,
                      tw`relative inline-flex items-center h-6 rounded-full w-11 transition-colors`,
                    ]}
                  >
                    <>
                      <span
                        css={[
                          showDrafts ? tw`translate-x-6` : tw`translate-x-1`,
                          tw`inline-block w-4 h-4 transform bg-white rounded-full transition-transform`,
                        ]}
                      />
                    </>
                  </Switch>
                  <Switch.Label tw="ml-2 font-medium text-warmGray-400">
                    Show Drafts
                  </Switch.Label>
                </div>
              </Switch.Group>
            </ProposalBadgeWrapper>
          </div>
        }
      >
        <ProposalsList showDrafts={showDrafts} />
      </Card>
    </GovernancePage>
  );
};
