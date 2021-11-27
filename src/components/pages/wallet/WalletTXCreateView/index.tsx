import type { Idl } from "@project-serum/anchor";
import type { IdlInstruction } from "@project-serum/anchor/dist/esm/idl";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import { IXForm } from "./IXForm";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export type InstructionInfo = {
  type: "instruction" | "method";
  instruction: IdlInstruction;
};

export const WalletTXCreateView: React.FC = () => {
  const [programID, setProgramID] = useState<PublicKey | null>(null);
  const [ix, setIx] = useState<InstructionInfo | null>(null);

  const { data: index } = useSWR<Record<string, string>>(
    "https://raw.githubusercontent.com/GokiProtocol/anchor-idl-registry/main/data/mainnet-beta/index.json",
    fetcher
  );
  const { data: idl } = useSWR<Idl>(
    programID
      ? `https://raw.githubusercontent.com/GokiProtocol/anchor-idl-registry/main/data/mainnet-beta/${programID.toString()}/idl.json`
      : null,
    fetcher
  );

  const ixs = useMemo((): InstructionInfo[] | undefined => {
    if (!idl) {
      return idl;
    }
    const methods = (idl?.state?.methods ?? []).map((ix) => ({
      type: "method" as const,
      instruction: ix,
    }));
    const instructions = (idl?.instructions ?? []).map((ix) => ({
      type: "instruction" as const,
      instruction: ix,
    }));
    return [...methods, ...instructions];
  }, [idl]);

  useEffect(() => {
    setIx(ixs?.[0] ?? null);
  }, [ixs]);

  return (
    <div>
      <h2>Create a transaction</h2>
      <label tw="grid gap-1">
        <span>Program</span>
        <select
          onChange={(e) => {
            setProgramID(e.target.value ? new PublicKey(e.target.value) : null);
          }}
        >
          <option key="" value="">
            {index ? "Select a program" : "Loading..."}
          </option>
          {index
            ? Object.entries(index).map(([programID, programName]) => {
                return (
                  <option key={programID} value={programID}>
                    {programName} ({programID})
                  </option>
                );
              })
            : null}
        </select>
      </label>
      {programID && (
        <label tw="grid gap-1">
          <span>Instruction</span>
          <select
            onChange={(e) => {
              const [ixType, ixName] = e.target.value.split("_");
              const theIX = ixs?.find(
                (ix) => ix.type === ixType && ix.instruction.name === ixName
              );
              setIx(theIX ?? null);
            }}
          >
            {ixs
              ? ixs.map((ix) => {
                  return (
                    <option
                      key={`${ix.type}_${ix.instruction.name}`}
                      value={`${ix.type}_${ix.instruction.name}`}
                    >
                      {ix.type === "method" ? `${idl?.name ?? ""}#` : ""}
                      {ix.instruction.name}
                    </option>
                  );
                })
              : null}
          </select>
        </label>
      )}
      {ix && <IXForm ix={ix} />}
    </div>
  );
};
