import { css } from "@emotion/react";
import { WalletKitProvider } from "@gokiprotocol/walletkit";
import type { Network } from "@saberhq/solana-contrib";
import type { ConnectedWallet, WalletProviderInfo } from "@saberhq/use-solana";
import * as Sentry from "@sentry/react";
import React from "react";
import { isMobile } from "react-device-detect";

import { APP_CONFIG } from "../../config";
import { environments } from "../../utils/environments";
import { notify } from "../../utils/notifications";
import { EnvironmentProvider } from "../../utils/useEnvironment";

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

const SOLE_NETWORKS: Record<string, Network> = {
  "goki.so": "mainnet-beta",
  "tribeca.so": "mainnet-beta",
  "anchor.so": "mainnet-beta",
  "testnet.anchor.so": "testnet",
  "devnet.anchor.so": "devnet",
  "devnet.goki.so": "devnet",
  "devnet.tribeca.so": "devnet",
};

/**
 * The only network for the app to display, if applicable.
 */
export const SOLE_NETWORK: Network | null =
  SOLE_NETWORKS[window.location.hostname] ?? null;

const networkConfigs = SOLE_NETWORK
  ? {
      [SOLE_NETWORK]: environments[SOLE_NETWORK],
    }
  : environments;

export const WalletConnectorProvider: React.FC<Props> = ({
  children,
}: Props) => {
  return (
    <WalletKitProvider
      defaultNetwork={SOLE_NETWORK ?? "mainnet-beta"}
      app={{
        name: APP_CONFIG.name,
        icon: (
          <img
            css={css`
              width: 48px;
              height: 48px;
            `}
            src={APP_CONFIG.favicon}
            alt={`${APP_CONFIG.name} Logo`}
          />
        ),
      }}
      networkConfigs={networkConfigs}
      onConnect={onConnect}
      onDisconnect={onDisconnect}
      onError={onError}
    >
      <EnvironmentProvider>{children}</EnvironmentProvider>
    </WalletKitProvider>
  );
};
