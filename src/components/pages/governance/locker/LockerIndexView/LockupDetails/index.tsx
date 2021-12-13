import { useUserEscrow } from "../../../hooks/useEscrow";
import { SetupVoting } from "./SetupVoting";
import { YourLockup } from "./YourLockup";

interface Props {
  className?: string;
}

export const LockupDetails: React.FC<Props> = ({ className }: Props) => {
  const { data: userLockup, isLoading } = useUserEscrow();

  if (isLoading) {
    return <></>;
  }

  if (!userLockup) {
    return <SetupVoting className={className} />;
  }

  return <YourLockup className={className} />;
};
