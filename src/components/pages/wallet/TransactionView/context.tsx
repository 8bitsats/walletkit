import type {
  SmartWalletEvents,
  SmartWalletTransactionData,
} from "@gokiprotocol/client";
import { GOKI_ADDRESSES } from "@gokiprotocol/client";
import { EventParser } from "@project-serum/anchor";
import type { ParsedAccountInfo } from "@saberhq/sail";
import { useSolana } from "@saberhq/use-solana";
import type { TransactionResponse } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";

import { SMART_WALLET_CODER } from "../../../../hooks/useSmartWallet";
import type { InstructionFmt } from "../../../../utils/anchor";

interface LoadedTransaction {
  tx: ParsedAccountInfo<SmartWalletTransactionData>;
  parsed?: InstructionFmt | null;
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
  events: SmartWalletEvent[];
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
                .then((resp) => {
                  if (!resp) {
                    return null;
                  }
                  const parser = new EventParser(
                    GOKI_ADDRESSES.SmartWallet,
                    SMART_WALLET_CODER
                  );
                  const events: SmartWalletEvent[] = [];
                  parser.parseLogs(resp.meta?.logMessages ?? [], (event) =>
                    events.push(event as SmartWalletEvent)
                  );
                  return {
                    ...resp,
                    events,
                    sig: sig.signature,
                    date: resp.blockTime
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
