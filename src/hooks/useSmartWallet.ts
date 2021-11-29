import type {
  SmartWalletTransactionData,
  SmartWalletTypes,
  SmartWalletWrapper,
} from "@gokiprotocol/client";
import {
  findTransactionAddress,
  GOKI_ADDRESSES,
  SmartWalletJSON,
} from "@gokiprotocol/client";
import type { InstructionParsed } from "@saberhq/anchor-contrib";
import { SuperCoder } from "@saberhq/anchor-contrib";
import type { ParsedAccountDatum } from "@saberhq/sail";
import { useParsedAccountsData } from "@saberhq/sail";
import type {
  KeyedAccountInfo,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import { startCase, uniq } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useQueries } from "react-query";
import { createContainer } from "unstated-next";

import { useSDK } from "../contexts/sdk";
import { fetchIDL } from "../utils/fetchers";

export const SMART_WALLET_CODER = new SuperCoder<SmartWalletTypes>(
  GOKI_ADDRESSES.SmartWallet,
  SmartWalletJSON
);

const decodeTransaction = (data: KeyedAccountInfo) =>
  SMART_WALLET_CODER.accountParsers.transaction(data.accountInfo.data);

export interface ParsedInstruction {
  ix: TransactionInstruction;
  parsed?: InstructionParsed | null;
  programName?: string;
}

export interface ParsedTX {
  tx: ParsedAccountDatum<SmartWalletTransactionData>;
  instructions?: ParsedInstruction[];
}

const useSmartWalletInner = (
  key?: PublicKey
): {
  key: PublicKey;
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
          .flatMap((tx) =>
            tx?.accountInfo.data.instructions.map((ix) =>
              ix.programId.toString()
            )
          )
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
      const instructions: {
        ix: TransactionInstruction;
        parsed?: InstructionParsed | null;
      }[] = tx.accountInfo.data.instructions.map((ix) => {
        const theData = {
          ...ix,
          data: Buffer.from(ix.data as Uint8Array),
        };
        const idlIndex = programIDsToFetch.findIndex(
          (pid) => pid === theData.programId.toString()
        );
        const idl = idls[idlIndex]?.data;
        if (idl) {
          const superCoder = new SuperCoder(theData.programId, idl);
          return {
            programName: startCase(idl.name),
            ix: theData,
            parsed: superCoder.parseInstruction(theData),
          };
        }
        return { ix: theData };
      });
      return { tx, instructions };
    });
  }, [idls, programIDsToFetch, txs]);

  return { key, smartWallet, parsedTXs };
};

export const { useContainer: useSmartWallet, Provider: SmartWalletProvider } =
  createContainer(useSmartWalletInner);
