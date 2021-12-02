import { findSmartWallet } from "@gokiprotocol/client";
import type { PublicKey } from "@solana/web3.js";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";

export const useSmartWalletAddress = (base: PublicKey | null | undefined) => {
  return useQuery(
    ["walletKey", base?.toString()],
    async () => {
      invariant(base);
      const [address] = await findSmartWallet(base);
      return address;
    },
    {
      enabled: !!base,
    }
  );
};
