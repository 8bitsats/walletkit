import { BasicPage } from "../../../common/page/BasicPage";
import { SignersSection } from "./SignersSection";
import { SubaccountsSection } from "./SubaccountsSection";

export const WalletSettingsView: React.FC = () => {
  return (
    <BasicPage title="Settings" description="Manage your smart wallet settings">
      <div tw="flex flex-col gap-12">
        <SignersSection />
        <SubaccountsSection />
      </div>
    </BasicPage>
  );
};
