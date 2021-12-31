import { BasicPage } from "../../../../common/page/BasicPage";
import { SaberLockupInner } from "./SaberLockupInner";

export const WalletSaberLockupView: React.FC = () => {
  return (
    <BasicPage title="Saber Lockup" description="Manage your Saber lockup">
      <SaberLockupInner />
    </BasicPage>
  );
};
