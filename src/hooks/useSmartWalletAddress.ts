import { findSmartWallet } from "@gokiprotocol/client";
import type { PublicKey } from "@solana/web3.js";
import { useQuery } from "react-query";

export const useSmartWalletAddress = (base: PublicKey) => {
  return useQuery(["walletKey", base.toString()], async () => {
    const [address] = await findSmartWallet(base);
    return address;
  });
};
