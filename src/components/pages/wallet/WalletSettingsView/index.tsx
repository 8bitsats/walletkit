import { BasicPage } from "../../../common/page/BasicPage";
import { SignersSection } from "./SignersSection";

export const WalletSettingsView: React.FC = () => {
  return (
    <BasicPage title="Settings" description="Manage your smart wallet settings">
      <SignersSection />
    </BasicPage>
  );
};
