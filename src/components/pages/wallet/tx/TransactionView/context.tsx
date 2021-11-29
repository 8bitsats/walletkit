import type {
  SmartWalletEvents,
  SmartWalletTransactionData,
} from "@gokiprotocol/client";
import type { ParsedAccountInfo } from "@saberhq/sail";
import { useSolana } from "@saberhq/use-solana";
import type { TransactionResponse } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";

import type { ParsedTX } from "../../../../../hooks/useSmartWallet";
import { SMART_WALLET_CODER } from "../../../../../hooks/useSmartWallet";

interface LoadedTransaction extends ParsedTX {
  tx: ParsedAccountInfo<SmartWalletTransactionData>;
}

export interface DetailedTransaction extends LoadedTransaction {
  index: number;
  title: string;
  historicalTXs?: HistoricalTX[];
  eta: Date | null;
  executedAt: Date | null;
}

export interface HistoricalTX extends TransactionResponse {
  sig: string;
  date: Date | null | undefined;
  events: readonly SmartWalletEvent[];
}

export type SmartWalletEvent = SmartWalletEvents[keyof SmartWalletEvents];

const useTransactionInner = (tx?: LoadedTransaction): DetailedTransaction => {
  if (!tx) {
    throw new Error(`missing tx`);
  }
  const { connection } = useSolana();
  const index = tx.tx.accountInfo.data.index.toNumber();
  const title = `TX-${index}`;

  const { data: txData } = tx.tx.accountInfo;

  const etaRaw = txData.eta.toNumber();
  const eta = etaRaw === -1 ? null : new Date(etaRaw * 1_000);
  const executedAtNum = tx.tx.accountInfo.data.executedAt.toNumber();
  const executedAt =
    executedAtNum === -1 ? null : new Date(executedAtNum * 1_000);

  const [historicalTXs, setHistoricalTXs] = useState<
    HistoricalTX[] | undefined
  >(undefined);
  useEffect(() => {
    void (async () => {
      const sigs = await connection.getSignaturesForAddress(
        tx.tx.accountId,
        undefined,
        "confirmed"
      );
      setHistoricalTXs(
        (
          await Promise.all(
            sigs.map((sig) =>
              connection
                .getTransaction(sig.signature, {
                  commitment: "confirmed",
                })
                .then((resp): HistoricalTX | null => {
                  if (!resp) {
                    return null;
                  }
                  const events = SMART_WALLET_CODER.parseProgramLogEvents(
                    resp.meta?.logMessages ?? []
                  );
                  return {
                    ...resp,
                    events,
                    sig: sig.signature,
                    date:
                      typeof resp.blockTime === "number"
                        ? new Date(resp.blockTime * 1_000)
                        : resp.blockTime,
                  };
                })
            )
          )
        ).filter((t): t is HistoricalTX => !!t)
      );
    })();
  }, [connection, tx.tx.accountId]);

  return { ...tx, index, title, historicalTXs, eta, executedAt };
};

export const { useContainer: useTransaction, Provider: TransactionProvider } =
  createContainer(useTransactionInner);
