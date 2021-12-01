import { useSolana } from "@saberhq/use-solana";
import type { PublicKey } from "@solana/web3.js";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";

export const useSignaturesForAddress = (
  address: PublicKey | null | undefined
) => {
  const { connection } = useSolana();
  return useQuery(
    ["signaturesForAddress", address?.toString()],
    async () => {
      invariant(address);
      return await connection.getSignaturesForAddress(address);
    },
    {
      enabled: !!address,
    }
  );
};
