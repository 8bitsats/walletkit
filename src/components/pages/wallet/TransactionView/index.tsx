import { useMemo } from "react";
import { Route, Switch, useParams } from "react-router-dom";
import { createContainer } from "unstated-next";

import type { ParsedTX } from "../../../../hooks/useSmartWallet";
import { useSmartWallet } from "../../../../hooks/useSmartWallet";
import { TransactionIndexView } from "./TransactionIndexView";
import { TransactionSignView } from "./TransactionSignView";

const useTransactionInner = (tx?: ParsedTX) => {
  if (!tx) {
    throw new Error(`missing tx`);
  }
  return tx;
};

export const { useContainer: useTransaction, Provider: TransactionProvider } =
  createContainer(useTransactionInner);

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
      <h1 tw="text-3xl font-bold pb-2 border-b mb-4">
        Transaction TX-{transactionSeq}
      </h1>
      {parsedTX && (
        <TransactionProvider initialState={parsedTX}>
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
      )}
    </div>
  );
};
