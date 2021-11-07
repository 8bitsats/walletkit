import { css } from "@emotion/react";
import { WalletKitProvider } from "@gokiprotocol/walletkit";
import type { ConnectedWallet, WalletProviderInfo } from "@saberhq/use-solana";
import * as Sentry from "@sentry/react";
import React from "react";
import { isMobile } from "react-device-detect";

import appInfo from "../../app.json";
import { notify } from "../../utils/notifications";
import { EnvironmentProvider } from "../../utils/useEnvironment";
import { useConfig } from "../config";

interface Props {
  children: React.ReactNode;
}

const onConnect = (wallet: ConnectedWallet, provider: WalletProviderInfo) => {
  const walletPublicKey = wallet.publicKey.toBase58();
  const keyToDisplay =
    walletPublicKey.length > 20
      ? `${walletPublicKey.substring(0, 7)}.....${walletPublicKey.substring(
          walletPublicKey.length - 7,
          walletPublicKey.length
        )}`
      : walletPublicKey;

  Sentry.setContext("wallet", {
    provider: provider.name,
    isMobile: isMobile,
  });

  window.gtag?.("set", {
    wallet_provider: provider.name,
    wallet_key: walletPublicKey,
  });
  window.gtag?.("event", "wallet_connect", {
    wallet_provider: provider.name,
  });

  notify({
    message: "Wallet update",
    description: "Connected to wallet " + keyToDisplay,
  });
};

const onDisconnect = () => {
  Sentry.setContext("wallet", {
    provider: null,
  });

  notify({
    message: "Wallet disconnected",
  });

  window.gtag?.("set", {
    wallet_provider: null,
    wallet_key: null,
  });
  window.gtag?.("event", "wallet_disconnect");
};

const onError = (err: Error) => {
  Sentry.captureException(err);
};

export const WalletConnectorProvider: React.FC<Props> = ({
  children,
}: Props) => {
  const { environments } = useConfig();

  return (
    <WalletKitProvider
      app={{
        name: appInfo.name,
        icon: (
          <img
            css={css`
              width: 48px;
              height: 48px;
            `}
            src="/images/icon.png"
            alt={`${appInfo.name} Logo`}
          />
        ),
      }}
      networkConfigs={environments}
      onConnect={onConnect}
      onDisconnect={onDisconnect}
      onError={onError}
    >
      <EnvironmentProvider>{children}</EnvironmentProvider>
    </WalletKitProvider>
  );
};
