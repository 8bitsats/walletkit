import type { PublicKey } from "@solana/web3.js";

import { useParsedTXByKey } from "../../../../../../hooks/useParsedTX";
import { SmartWalletProvider } from "../../../../../../hooks/useSmartWallet";
import { LoadingPage } from "../../../../../common/LoadingPage";
import { TransactionProvider } from "../../../../wallet/tx/TransactionView/context";
import { InstructionsInner } from "./InstructionsInner";

interface Props {
  txKey: PublicKey;
}

export const EmbedTX: React.FC<Props> = ({ txKey }: Props) => {
  const { data: parsedTX, isLoading } = useParsedTXByKey(txKey);
  return (
    <div tw="py-6">
      {isLoading && !parsedTX && <LoadingPage />}
      {parsedTX && (
        <SmartWalletProvider
          initialState={parsedTX.tx.accountInfo.data.smartWallet}
        >
          <TransactionProvider initialState={parsedTX}>
            <InstructionsInner />
          </TransactionProvider>
        </SmartWalletProvider>
      )}
    </div>
  );
};
