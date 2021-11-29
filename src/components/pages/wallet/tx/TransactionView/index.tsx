import { useMemo } from "react";
import { Route, Switch, useParams } from "react-router-dom";

import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { TransactionProvider } from "./context";
import { TransactionIndexView } from "./TransactionIndexView";
import { TransactionSignView } from "./TransactionSignView";

export const TransactionView: React.FC = () => {
  const { parsedTXs } = useSmartWallet();
  const { transactionSeq } = useParams<{ transactionSeq: string }>();
  const parsedTX = useMemo(
    () =>
      parsedTXs.find(
        (t) => t.tx?.accountInfo.data.index.toString() == transactionSeq
      ),
    [parsedTXs, transactionSeq]
  );
  return (
    <div tw="py-6 px-12">
      {parsedTX && parsedTX.tx && (
        <>
          <TransactionProvider initialState={{ ...parsedTX, tx: parsedTX.tx }}>
            <Switch>
              <Route
                path="/wallets/:walletKey/tx/:transactionSeq/sign"
                component={TransactionSignView}
              />
              <Route
                path="/wallets/:walletKey/tx/:transactionSeq"
                component={TransactionIndexView}
              />
            </Switch>
          </TransactionProvider>
        </>
      )}
    </div>
  );
};
