import { Card } from "../../../../../common/governance/Card";
import { LoadingPage } from "../../../../../common/LoadingPage";
import { useUserEscrow } from "../../../hooks/useEscrow";
import { SetupVoting } from "./SetupVoting";
import { YourLockup } from "./YourLockup";

interface Props {
  className?: string;
}

export const LockupDetails: React.FC<Props> = ({ className }: Props) => {
  const { data: userLockup, isLoading } = useUserEscrow();

  if (isLoading) {
    return (
      <Card className={className} title="Your Lockup">
        <LoadingPage />
      </Card>
    );
  }

  if (!userLockup) {
    return <SetupVoting className={className} />;
  }

  return <YourLockup className={className} />;
};
