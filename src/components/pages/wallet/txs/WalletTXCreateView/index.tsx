import { Program, Provider } from "@project-serum/anchor";
import type { IdlInstruction } from "@project-serum/anchor/dist/esm/idl";
import { SignerWallet } from "@saberhq/solana-contrib";
import { useSolana } from "@saberhq/use-solana";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import { useIDL } from "../../../../../hooks/useIDLs";
import { fetcher } from "../../../../../utils/fetcher";
import { Select } from "../../../../common/inputs/InputText";
import { BasicPage } from "../../../../common/page/BasicPage";
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
  const { data: idlData } = useIDL(programID);
  const idl = idlData?.idl;

  const ixs = useMemo((): InstructionInfo[] | null | undefined => {
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
    <BasicPage
      title="Propose a Transaction"
      description="Interact with any Anchor program."
    >
      <form tw="grid gap-4">
        <div tw="p-4 border grid gap-4">
          <label tw="grid gap-1">
            <span>Program</span>
            <Select
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
            </Select>
          </label>
          {programID && (
            <label tw="grid gap-1">
              <span>Instruction</span>
              <Select
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
              </Select>
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
    </BasicPage>
  );
};