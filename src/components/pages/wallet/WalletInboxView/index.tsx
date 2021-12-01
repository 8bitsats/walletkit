import { Notice } from "../../../common/Notice";
import { BasicPage } from "../../../common/page/BasicPage";

const today = new Date().toLocaleDateString(undefined, {
  day: "numeric",
  month: "long",
  weekday: "long",
});

export const WalletInboxView: React.FC = () => {
  return (
    <BasicPage title="gm, Goki user" description={`Today is ${today}.`}>
      <Notice>Select an action on the left.</Notice>
    </BasicPage>
  );
};
