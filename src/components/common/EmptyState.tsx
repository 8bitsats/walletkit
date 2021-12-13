import { ConnectWalletButton } from "@gokiprotocol/walletkit";
import tw, { css } from "twin.macro";

import { ReactComponent as SolanaIcon } from "../layout/WalletLayout/SolanaIcon.svg";

interface Props {
  icon?: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<Props> = ({
  icon,
  title,
  children,
  className,
}: Props) => {
  return (
    <div
      tw="w-full py-12 text-sm flex flex-col items-center"
      className={className}
    >
      {icon && (
        <div
          tw="w-20 h-20 mb-3"
          css={css`
            & > svg,
            & > img {
              ${tw`w-full h-full text-gray-300`}
            }
          `}
        >
          {icon}
        </div>
      )}
      <div tw="h-6">
        <span tw="text-secondary dark:text-coolGray-300">{title}</span>
      </div>
      <div>{children}</div>
    </div>
  );
};

export const EmptyStateConnectWallet: React.FC<Partial<Props>> = (
  props: Partial<Props>
) => {
  return (
    <EmptyState
      icon={<SolanaIcon />}
      title="Connect your wallet to view this page."
      {...props}
    >
      <ConnectWalletButton tw="mt-4" />
    </EmptyState>
  );
};
