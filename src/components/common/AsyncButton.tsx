import type { Arrow } from "@arrowprotocol/arrow";
import { useWalletKit } from "@gokiprotocol/walletkit";
import React from "react";

import { useSDK } from "../../contexts/sdk";
import { Button } from "./Button";

interface IProps
  extends Omit<React.ComponentPropsWithRef<typeof Button>, "onClick"> {
  onClick?: (sdkMut: Arrow) => Promise<void> | void;
  connectWalletOverride?: string;
}

export const AsyncButton: React.FC<IProps> = ({
  onClick,
  children,
  connectWalletOverride,
  ...rest
}: IProps) => {
  const { connect } = useWalletKit();
  const { sdkMut } = useSDK();
  return sdkMut !== null ? (
    <Button
      size="md"
      onClick={
        onClick
          ? async () => {
              await onClick(sdkMut);
            }
          : undefined
      }
      {...rest}
    >
      {children}
    </Button>
  ) : (
    <Button size="md" variant="muted" {...rest} onClick={() => connect()}>
      {connectWalletOverride ?? "Connect Wallet"}
    </Button>
  );
};
