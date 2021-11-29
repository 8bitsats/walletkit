import { BasicPage } from "../../../../common/page/BasicPage";
import { BasicSection } from "../../../../common/page/Section";
import { Tokens } from "./Tokens";

export const WalletTreasuryView: React.FC = () => {
  return (
    <BasicPage
      title="Treasury Management"
      description="Manage your tokens and staking positions"
    >
      <div tw="grid gap-12">
        <BasicSection title="Assets">
          <Tokens />
        </BasicSection>
        <BasicSection
          title="Farms"
          description="(coming soon) Manage your yield farming positions."
        ></BasicSection>
      </div>
    </BasicPage>
  );
};
