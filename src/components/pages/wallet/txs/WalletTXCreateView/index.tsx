import type { Idl } from "@project-serum/anchor";
import { Program, Provider } from "@project-serum/anchor";
import type { IdlInstruction } from "@project-serum/anchor/dist/esm/idl";
import { SignerWallet } from "@saberhq/solana-contrib";
import { useSolana } from "@saberhq/use-solana";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import { fetcher } from "../../../../../utils/fetcher";
import { IXForm } from "./IXForm";

export type InstructionInfo = {
  type: "instruction" | "method";
  instruction: IdlInstruction;
};

export const WalletTXCreateView: React.FC = () => {
  const { connection } = useSolana();
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

  const program = useMemo(() => {
    if (idl && programID) {
      const provider = new Provider(
        connection,
        new SignerWallet(Keypair.generate()),
        Provider.defaultOptions()
      );
      return new Program(idl, programID, provider);
    }
    return null;
  }, [connection, idl, programID]);

  useEffect(() => {
    setIx(ixs?.[0] ?? null);
  }, [ixs]);

  return (
    <div>
      <h1 tw="text-3xl font-bold mb-4">Create a transaction</h1>
      <form tw="grid gap-4">
        <div tw="p-4 border grid gap-4">
          <label tw="grid gap-1">
            <span>Program</span>
            <select
              onChange={(e) => {
                setProgramID(
                  e.target.value ? new PublicKey(e.target.value) : null
                );
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
        </div>
        {ix && program && (
          <div tw="p-4 border">
            <IXForm
              key={`${program.programId.toString()}_${ix.type}_${
                ix.instruction.name
              }`}
              ix={ix}
              program={program}
            />
          </div>
        )}
      </form>
    </div>
  );
};
