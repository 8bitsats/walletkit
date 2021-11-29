import type {
  SmartWalletEvents,
  SmartWalletTransactionData,
} from "@gokiprotocol/client";
import type { ParsedAccountInfo } from "@saberhq/sail";
import { TransactionEnvelope } from "@saberhq/solana-contrib";
import { useSolana } from "@saberhq/use-solana";
import type { TransactionResponse } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { createContainer } from "unstated-next";

import type { ParsedTX } from "../../../../../hooks/useSmartWallet";
import {
  SMART_WALLET_CODER,
  useSmartWallet,
} from "../../../../../hooks/useSmartWallet";
import { shortenAddress } from "../../../../../utils/utils";

interface LoadedTransaction extends ParsedTX {
  tx: ParsedAccountInfo<SmartWalletTransactionData>;
}

export interface DetailedTransaction extends LoadedTransaction {
  index: number;
  id: string;
  title: string;
  historicalTXs?: HistoricalTX[];
  eta: Date | null;
  executedAt: Date | null;
  txEnv: TransactionEnvelope | null;
  state: "stale" | "active" | "approved" | "executed";
  numSigned: number;
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
  const { smartWallet } = useSmartWallet();
  const { connection, providerMut } = useSolana();
  const index = tx.tx.accountInfo.data.index.toNumber();

  const id = `TX-${index}`;
  const title = `${
    tx.instructions
      ?.map(
        (ix) =>
          ix.parsed?.name?.toString() ??
          `Interact with ${
            ix.programName ?? shortenAddress(ix.ix.programId.toString())
          }`
      )
      .join(", ") ?? "Unknown Trnasaction"
  }`;

  const { data: txData } = tx.tx.accountInfo;

  const txEnv = useMemo(() => {
    if (!providerMut) {
      return null;
    }
    return new TransactionEnvelope(
      providerMut,
      tx.tx.accountInfo.data.instructions.map((ix) => ({
        ...ix,
        data: Buffer.from(ix.data as Uint8Array),
      }))
    );
  }, [providerMut, tx.tx.accountInfo.data.instructions]);

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

  const numSigned = (
    (tx?.tx.accountInfo.data.signers ?? []) as boolean[]
  ).filter((x) => !!x).length;

  const isOwnerSetValid =
    tx.tx.accountInfo.data.ownerSetSeqno === smartWallet?.data?.ownerSetSeqno;
  const threshold = smartWallet ? smartWallet.data?.threshold.toNumber() : null;
  const state = executedAt
    ? "executed"
    : !isOwnerSetValid
    ? "stale"
    : typeof threshold === "number" && numSigned >= threshold
    ? "approved"
    : "active";

  return {
    ...tx,
    id,
    index,
    title,
    historicalTXs,
    eta,
    executedAt,
    txEnv,
    state,
    numSigned,
  };
};

export const { useContainer: useTransaction, Provider: TransactionProvider } =
  createContainer(useTransactionInner);
