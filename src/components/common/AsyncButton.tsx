import type { GokiSDK } from "@gokiprotocol/client";
import { useWalletKit } from "@gokiprotocol/walletkit";
import React from "react";

import { useSDK } from "../../contexts/sdk";
import { Button } from "./Button";

interface Props
  extends Omit<React.ComponentPropsWithRef<typeof Button>, "onClick"> {
  onClick?: (sdkMut: GokiSDK) => Promise<void> | void;
  connectWalletOverride?: string;
}

export const AsyncButton: React.FC<Props> = ({
  onClick,
  children,
  connectWalletOverride,
  ...rest
}: Props) => {
  const { connect } = useWalletKit();
  const { sdkMut } = useSDK();
  return sdkMut !== null ? (
    <Button
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
    <Button variant="muted" {...rest} onClick={() => connect()}>
      {connectWalletOverride ?? "Connect Wallet"}
    </Button>
  );
};
