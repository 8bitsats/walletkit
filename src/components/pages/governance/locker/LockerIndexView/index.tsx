import { Link } from "react-router-dom";

import { Button } from "../../../../common/Button";
import { Card } from "../../../../common/governance/Card";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { useGovernor } from "../../hooks/useGovernor";
import { EscrowInfo } from "./EscrowInfo";
import { LockupDetails } from "./LockupDetails";

export const LockerIndexView: React.FC = () => {
  const { path } = useGovernor();
  return (
    <GovernancePage title="Vote Locker">
      <div tw="flex gap-4 items-start">
        <div tw="flex-basis[300px] flex flex-col gap-4 flex-shrink-0">
          <EscrowInfo />
          <Card>
            <div tw="px-7 py-5">
              <Link to={`${path}/proposals/create`}>
                <Button size="md" tw="w-full" variant="primary">
                  Create Proposal
                </Button>
              </Link>
            </div>
          </Card>
        </div>
        <LockupDetails tw="flex-grow[2]" />
      </div>
    </GovernancePage>
  );
};
