import "react-app-polyfill/stable";

import { ThemeProvider } from "@emotion/react";
import { GOKI_ADDRESSES, SmartWalletJSON } from "@gokiprotocol/client";
import { QUARRY_IDLS } from "@quarryprotocol/quarry-sdk";
import type {
  SailError,
  SailGetMultipleAccountsError,
  SailTransactionError,
  UseSailArgs,
} from "@saberhq/sail";
import { SailProvider } from "@saberhq/sail";
import * as Sentry from "@sentry/react";
import type { PublicKey } from "@solana/web3.js";
import { mapValues } from "lodash";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { App } from "./App";
import { ConfigProvider } from "./contexts/config";
import { QuarryInterfaceProvider } from "./contexts/quarry";
import type { ProgramKey } from "./contexts/sdk";
import { SDKProvider } from "./contexts/sdk";
import { SettingsProvider } from "./contexts/settings";
import { WalletConnectorProvider } from "./contexts/wallet";
import { theme } from "./theme";
import { describeRPCError, handleException } from "./utils/error";
import { notify } from "./utils/notifications";
import { parseIdlErrors, ProgramError } from "./utils/programError";

const programErrors = mapValues(
  {
    SmartWallet: SmartWalletJSON,
    ...QUARRY_IDLS,
  },
  (prog) => parseIdlErrors(prog)
);

const programIDs = Object.entries({
  ...GOKI_ADDRESSES,
}).reduce(
  (acc, [name, prog]: [name: string, prog: PublicKey]) => ({
    ...acc,
    [prog.toString()]: name,
  }),
  {}
) as Record<string, ProgramKey>;

const onTxSend: UseSailArgs["onTxSend"] = ({ network, pending, message }) => {
  notify({
    message,
    txids: pending.map((p) => p.signature),
    env: network,
  });
};

const onTxError = (error: SailTransactionError) => {
  // Log the program error
  const err = error.originalError as Error;
  const { tx } = error;
  if (err.toString().includes(": custom program error:")) {
    // todo: figure out the duplicates
    if (error.network !== "localnet") {
      console.error(`TX`, tx.generateInspectLink(error.network));
    }
    const progError = ProgramError.parse(err, tx, programIDs, programErrors);
    if (progError) {
      const message = err.message.split(":")[1] ?? "Transaction failed";
      notify({
        message,
        description: `${progError.message}`,
        env: error.network,
        type: "error",
      });
      const sentryArgs = {
        tags: {
          program: progError.program ?? "AnchorInternal",
          "program.error.code": progError.code,
          "program.error.name": progError.errorName,
        },
        extra: {
          progError,
          message,
          originalError: err,
        },
      } as const;
      console.error(progError, sentryArgs);
      Sentry.captureException(progError, sentryArgs);
      return;
    }
  }

  if (/(.+)?: custom program error: 0x1$/.exec(err.message.toString())) {
    notify({
      message: `Insufficient SOL (need more SOL)`,
      description: error.message,
      env: error.network,
      type: "warn",
    });
    return;
  } else if (err.message.includes("Signature request denied")) {
    notify({
      message: `Transaction cancelled`,
      description: error.message,
      env: error.network,
      type: "info",
    });
    return;
  } else {
    notify({
      message: `Transaction failed (try again later)`,
      description: error.message,
      env: error.network,
      type: "error",
    });
    const { tx } = error;
    if (error.network !== "localnet") {
      console.error(`TX`, tx.generateInspectLink(error.network));
    }
  }
  const sentryArgs = {
    tags: {
      "tx.error": error.tag,
    },
    fingerprint: error.fingerprint,
  } as const;
  console.error(error, sentryArgs);
  Sentry.captureException(error, sentryArgs);
};

const onGetMultipleAccountsError = (
  err: SailGetMultipleAccountsError
): void => {
  handleException(err, {
    source: "onGetMultipleAccountsError",
    userMessage: {
      title: "Error fetching data from Solana",
      description: describeRPCError((err.originalError as Error).message),
    },
  });
  return;
};

const onSailError = (err: SailError) => {
  if (err.name === "SailTransactionError") {
    onTxError(err as SailTransactionError);
  } else if (err.name === "SailGetMultipleAccountsError") {
    onGetMultipleAccountsError(err as SailGetMultipleAccountsError);
  } else if (err.name === "SailTransactionSignError") {
    notify({
      message: "Failed to sign transaction",
      description: err.message,
    });
  } else {
    handleException(err, {
      source: "sail.unknown",
    });
  }
};

const queryClient = new QueryClient();

export const AppWithProviders: React.FC = () => {
  return (
    <React.StrictMode>
      <ConfigProvider>
        <ThemeProvider theme={theme}>
          <WalletConnectorProvider>
            <SailProvider initialState={{ onTxSend, onSailError }}>
              <QuarryInterfaceProvider>
                <SDKProvider>
                  <SettingsProvider>
                    <QueryClientProvider client={queryClient}>
                      <ReactQueryDevtools initialIsOpen={false} />
                      <App />
                    </QueryClientProvider>
                  </SettingsProvider>
                </SDKProvider>
              </QuarryInterfaceProvider>
            </SailProvider>
          </WalletConnectorProvider>
        </ThemeProvider>
      </ConfigProvider>
    </React.StrictMode>
  );
};
