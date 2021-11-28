import type { SmartWalletTransactionData } from "@gokiprotocol/client";
import { SmartWalletJSON } from "@gokiprotocol/client";
import type { SmartWalletWrapper } from "@gokiprotocol/client/dist/cjs/wrappers/smartWallet";
import { findTransactionAddress } from "@gokiprotocol/client/dist/cjs/wrappers/smartWallet";
import { Coder } from "@project-serum/anchor";
import type { ParsedAccountDatum } from "@saberhq/sail";
import { useParsedAccountsData } from "@saberhq/sail";
import type {
  KeyedAccountInfo,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import { uniq } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useQueries } from "react-query";
import { createContainer } from "unstated-next";

import { useSDK } from "../contexts/sdk";
import type { InstructionFmt } from "../utils/anchor";
import { formatTxInstruction } from "../utils/anchor";
import { fetchIDL } from "../utils/fetchers";

const smartWalletCoder = new Coder(SmartWalletJSON);

const decodeTransaction = (data: KeyedAccountInfo) =>
  smartWalletCoder.accounts.decode<SmartWalletTransactionData>(
    "Transaction",
    data.accountInfo.data
  );

interface ParsedTX {
  tx: ParsedAccountDatum<SmartWalletTransactionData>;
  parsed?: InstructionFmt | null;
}

const useSmartWalletInner = (
  key?: PublicKey
): {
  smartWallet: SmartWalletWrapper | null;
  parsedTXs: ParsedTX[];
} => {
  if (!key) {
    throw new Error("missing key");
  }
  const { sdkMut } = useSDK();
  const [smartWallet, setSmartWallet] = useState<SmartWalletWrapper | null>(
    null
  );

  const [txAddrs, setTxAddrs] = useState<PublicKey[]>([]);
  const txs = useParsedAccountsData(txAddrs, decodeTransaction);

  useEffect(() => {
    if (!sdkMut) {
      setSmartWallet(null);
      return;
    }
    void (async () => {
      const sw = await sdkMut.loadSmartWallet(key);
      setSmartWallet(sw);

      const numTransactions = sw.data?.numTransactions.toNumber();
      if (numTransactions) {
        const txAddrs = await Promise.all(
          Array(numTransactions)
            .fill(null)
            .map(async (_, i) => {
              const [key] = await findTransactionAddress(sw.key, i);
              return key;
            })
        );
        setTxAddrs(txAddrs);
      }
    })();
  }, [key, sdkMut]);

  const programIDsToFetch = useMemo(
    () =>
      uniq(
        txs
          .map((tx) => tx?.accountInfo.data.instruction.programId.toString())
          .filter((x): x is string => !!x)
      ),
    [txs]
  );

  const idls = useQueries(
    programIDsToFetch.map((pid) => ({
      queryKey: ["idl", pid],
      queryFn: () => fetchIDL(pid),
    }))
  );

  const parsedTXs = useMemo(() => {
    return txs.map((tx): ParsedTX => {
      if (!tx) {
        return { tx };
      }
      const txInstruction: TransactionInstruction = {
        ...tx.accountInfo.data.instruction,
        data: Buffer.from(tx.accountInfo.data.instruction.data as Uint8Array),
      };
      const idlIndex = programIDsToFetch.findIndex(
        (pid) => pid === txInstruction.programId.toString()
      );
      const idl = idls[idlIndex]?.data;
      if (idl) {
        return {
          tx,
          parsed: formatTxInstruction({
            coder: new Coder(idl),
            txInstruction,
          }),
        };
      }
      return { tx };
    });
  }, [idls, programIDsToFetch, txs]);

  return { smartWallet, parsedTXs };
};

export const { useContainer: useSmartWallet, Provider: SmartWalletProvider } =
  createContainer(useSmartWalletInner);
