import {
  useConnectedWallet,
  useConnectionContext,
  useWallet,
} from "@saberhq/use-solana";
import { ExtraErrorData as ExtraErrorDataIntegration } from "@sentry/integrations";
import * as Sentry from "@sentry/react";
import type { RouterHistory } from "@sentry/react/dist/reactrouter";
import { Integrations } from "@sentry/tracing";
import { H } from "highlight.run";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

/**
 * Sets up analytics. Only call this file ONCE.
 */
export const useAnalytics = (): void => {
  const { network } = useConnectionContext();
  const wallet = useConnectedWallet();
  const { walletProviderInfo } = useWallet();
  const history = useHistory();

  // Google Analytics
  useEffect(() => {
    return history.listen(() => {
      const { location } = history;
      window.gtag?.("event", "page_view", {
        page_path: location.pathname + location.search,
        page_location: location.key ?? window.location.href,
        page_title: document.title,
      });
    });
  }, [history]);

  const owner = wallet?.publicKey;
  useEffect(() => {
    if (owner) {
      Sentry.setUser({
        id: owner.toString(),
      });
      H.identify(owner.toString());
    } else {
      Sentry.configureScope((scope) => scope.setUser(null));
    }
  }, [owner]);

  useEffect(() => {
    Sentry.setTag("network", network);
    Sentry.setTag("wallet.provider", walletProviderInfo?.name);
  }, [network, walletProviderInfo?.name]);

  useEffect(() => {
    if (process.env.REACT_APP_HIGHLIGHT_ID) {
      H.init(process.env.REACT_APP_HIGHLIGHT_ID, {
        environment: "production",
        enableStrictPrivacy: false,
      });
    }
    if (process.env.REACT_APP_SENTRY_DSN) {
      const sentryCfg = {
        environment: process.env.REACT_APP_SENTRY_ENVIRONMENT ?? "unknown",
        release: process.env.REACT_APP_SENTRY_RELEASE ?? "unknown",
      };
      Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        integrations: [
          new Integrations.BrowserTracing({
            routingInstrumentation: Sentry.reactRouterV5Instrumentation(
              history as unknown as RouterHistory
            ),
          }),
          new ExtraErrorDataIntegration({
            depth: 3,
          }),
        ],
        tracesSampleRate: 0.2,
        ...sentryCfg,
      });

      console.log(
        `Initializing Sentry environment at release ${sentryCfg.release} in environment ${sentryCfg.environment}`
      );
    } else {
      console.warn(
        `REACT_APP_SENTRY_DSN not found. Sentry will not be loaded.`
      );
    }

    // set up Highlight session scope
    void (async () => {
      const sessionURL = await H.getSessionURL();
      Sentry.configureScope((scope) => {
        scope.setExtra("highlightSessionURL", sessionURL);
      });
    })();
  }, [history]);
};
