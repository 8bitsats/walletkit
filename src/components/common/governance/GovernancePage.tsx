import { useGovernorInfo } from "../../pages/governance/hooks/useGovernor";
import { LoadingPage } from "../LoadingPage";
import { NotFoundPage } from "../NotFoundPage";
import { GovernancePageInner } from "./GovernancePageInner";

interface Props {
  title: React.ReactNode;
  header?: React.ReactNode;
  right?: React.ReactNode;
  preContent?: React.ReactNode;
  children?: React.ReactNode;
  contentStyles?: React.CSSProperties;
  containerStyles?: React.CSSProperties;
  hideDAOName?: boolean;
}

export const GovernancePage: React.FC<Props> = ({ ...props }: Props) => {
  const info = useGovernorInfo();
  if (info?.loading) {
    return <LoadingPage />;
  }
  if (!info) {
    return <NotFoundPage />;
  }
  return <GovernancePageInner {...props} />;
};
