import { Keypair } from "@solana/web3.js";
import { useMemo } from "react";

export const useKeypair = (valueStr: string): Keypair | null => {
  return useMemo(() => {
    if (!valueStr) {
      return null;
    }
    try {
      return Keypair.fromSecretKey(
        Uint8Array.from([...(JSON.parse(valueStr) as number[])])
      );
    } catch (e) {
      return null;
    }
  }, [valueStr]);
};
