import { Route, Switch, useParams } from "react-router-dom";

import { useParsedTX } from "../../../../../hooks/useParsedTX";
import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { LoadingPage } from "../../../../common/LoadingPage";
import { TransactionProvider } from "./context";
import { TransactionIndexView } from "./TransactionIndexView";
import { TransactionSignView } from "./TransactionSignView";

export const TransactionView: React.FC = () => {
  const { key } = useSmartWallet();
  const { transactionSeq } = useParams<{ transactionSeq: string }>();
  const { data: parsedTX, isLoading } = useParsedTX(
    key,
    parseInt(transactionSeq)
  );
  return (
    <div tw="py-6">
      {isLoading && !parsedTX && <LoadingPage />}
      {parsedTX && (
        <>
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
        </>
      )}
    </div>
  );
};
