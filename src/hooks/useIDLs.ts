import type { PublicKey } from "@solana/web3.js";
import { useQueries } from "react-query";
import invariant from "tiny-invariant";

import { fetchIDL } from "../utils/fetchers";

export const useIDLs = (idls: (PublicKey | null | undefined)[]) => {
  return useQueries(
    idls.map((pid) => ({
      queryKey: ["idl", pid?.toString()],
      queryFn: async () => {
        invariant(pid);
        return {
          programID: pid,
          idl: await fetchIDL(pid.toString()),
        };
      },
      enabled: !!pid,
    }))
  );
};

export const useIDL = (address: PublicKey | null | undefined) => {
  const ret = useIDLs([address])[0];
  invariant(ret);
  return ret;
};
