import { useSDK } from "../../../../../../contexts/sdk";
import { Card } from "../../../../../common/governance/Card";
import { LoadingPage } from "../../../../../common/LoadingPage";
import { useUserEscrow } from "../../../hooks/useEscrow";
import { SetupVoting } from "./SetupVoting";
import { YourLockup } from "./YourLockup";

interface Props {
  className?: string;
}

export const LockupDetails: React.FC<Props> = ({ className }: Props) => {
  const { sdkMut } = useSDK();
  const { data: userLockup, isLoading, isFetched } = useUserEscrow();

  if (isLoading || (sdkMut && !userLockup && !isFetched)) {
    return (
      <Card className={className} title="Your Lockup">
        <div tw="py-6">
          <LoadingPage />
        </div>
      </Card>
    );
  }

  if (!userLockup) {
    return <SetupVoting className={className} />;
  }

  return <YourLockup className={className} />;
};
