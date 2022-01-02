import { Card } from "../../../common/governance/Card";
import { GovernancePage } from "../../../common/governance/GovernancePage";
import { ProgramsList } from "./ProgramsList";

export const ProgramsView: React.FC = () => {
  return (
    <GovernancePage title="Programs">
      <Card
        title={
          <div tw="flex w-full items-center justify-between">
            <div tw="flex items-center gap-4">
              <h2>Manage Programs</h2>
            </div>
          </div>
        }
      >
        <ProgramsList />
      </Card>
    </GovernancePage>
  );
};
