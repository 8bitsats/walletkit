import { Card } from "../../../common/Card";
import { BasicPage } from "../../../common/page/BasicPage";

const today = new Date().toLocaleDateString(undefined, {
  day: "numeric",
  month: "long",
  weekday: "long",
});

export const WalletInboxView: React.FC = () => {
  return (
    <BasicPage title="gm, Goki user" description={`Today is ${today}.`}>
      <Card>Select an action on the left.</Card>
    </BasicPage>
  );
};
