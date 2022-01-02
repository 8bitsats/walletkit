import type { PublicKey } from "@solana/web3.js";
import { useQueries } from "react-query";
import invariant from "tiny-invariant";

import { programLabel } from "../utils/programs";

const makeURL = (programID: string) =>
  `https://raw.githubusercontent.com/DeployDAO/solana-program-index/master/programs/${programID}.json`;

export interface ProgramMeta {
  label: string;
}

export const fetchProgramMeta = async (
  address: string
): Promise<ProgramMeta | null> => {
  const response = await fetch(makeURL(address));
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return (await response.json()) as ProgramMeta;
};

export const useProgramMetas = (
  addresses: (PublicKey | null | undefined)[]
) => {
  return useQueries(
    addresses.map((pid) => ({
      queryKey: ["programMeta", pid?.toString()],
      queryFn: async () => {
        invariant(pid);
        return {
          programID: pid,
          meta: await fetchProgramMeta(pid.toString()),
        };
      },
      enabled: !!pid,
    }))
  );
};

export const useProgramMeta = (address: PublicKey | null | undefined) => {
  const ret = useProgramMetas([address])[0];
  invariant(ret);
  return ret;
};

export const useProgramLabel = (programId: PublicKey | null | undefined) => {
  const { data: meta } = useProgramMeta(programId);
  const label =
    meta?.meta?.label ??
    (programId
      ? programLabel(programId.toString()) ??
        `Unknown (${programId.toString()}) Program`
      : "Unknown Program");
  return label;
};
