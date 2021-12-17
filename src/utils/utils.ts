import type { SmartWalletTransactionData } from "@gokiprotocol/client";
import type BN from "bn.js";
import { useCallback, useState } from "react";

export function useLocalStorageState<T>(
  key: string,
  defaultState: T
): [T, (newState: T) => void] {
  const [state, setState] = useState<T>((): T => {
    // NOTE: Not sure if this is ok
    const storedState = localStorage.getItem(key);
    if (storedState) {
      return JSON.parse(storedState) as T;
    }
    return defaultState;
  });

  const setLocalStorageState = useCallback(
    (newState: T) => {
      const changed = state !== newState;
      if (!changed) {
        return;
      }
      setState(newState);
      if (newState === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newState));
      }
    },
    [state, key]
  );

  return [state, setLocalStorageState];
}

/**
 * shorten the checksummed version of the input address to have 4 characters at start and end
 * @param address
 * @param chars
 * @returns
 */
export function shortenAddress(address: string, chars = 5): string {
  return `${address.substring(0, chars)}...${address.substring(
    address.length - chars
  )}`;
}

/**
 * Converts a Solana timestamp to a Date.
 *
 * @param num
 * @returns
 */
export const tsToDate = (num: BN): Date => new Date(num.toNumber() * 1_000);

export const gokiTXLink = (tx: SmartWalletTransactionData) =>
  `https://beta.goki.so/#/wallets/${tx.smartWallet.toString()}/tx/${tx.index.toString()}`;
