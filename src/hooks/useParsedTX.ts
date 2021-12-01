import { SuperCoder } from "@saberhq/anchor-contrib";
import { useParsedAccountData } from "@saberhq/sail";
import { useSolana } from "@saberhq/use-solana";
import type { PublicKey } from "@solana/web3.js";
import { startCase } from "lodash";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";

import { parseNonAnchorInstruction } from "../utils/instructions/parseNonAnchorInstruction";
import { displayAddress, programLabel } from "../utils/programs";
import { useIDLs } from "./useIDLs";
import type { ParsedInstruction } from "./useSmartWallet";
import { decodeTransaction } from "./useSmartWallet";
import { useTXAddress } from "./useTXAddress";

export const useParsedTX = (smartWalletKey: PublicKey, index: number) => {
  const { network } = useSolana();
  const { data: key } = useTXAddress(smartWalletKey, index);
  const { data: txData, loading } = useParsedAccountData(
    key,
    decodeTransaction
  );
  const idls = useIDLs(
    txData?.accountInfo.data.instructions.map((ix) => ix.programId) ?? []
  );

  const query = useQuery(
    ["parsedTX", network, smartWalletKey.toString(), index],
    () => {
      invariant(txData);
      const instructions: ParsedInstruction[] =
        txData.accountInfo.data.instructions
          .map((rawIx) => ({
            ...rawIx,
            data: Buffer.from(rawIx.data as Uint8Array),
          }))
          .map((ix): Omit<ParsedInstruction, "title"> => {
            const idl = idls.find((theIDL) =>
              theIDL.data?.programID.equals(ix.programId)
            )?.data?.idl;
            const label = programLabel(ix.programId.toString());
            if (idl) {
              const superCoder = new SuperCoder(ix.programId, idl);
              return {
                programName: label ?? startCase(idl.name),
                ix,
                parsed: { ...superCoder.parseInstruction(ix), anchor: true },
              };
            }
            const parsedNonAnchor = parseNonAnchorInstruction(ix);
            return { ix, programName: label, parsed: parsedNonAnchor };
          })
          .map(
            (ix): ParsedInstruction => ({
              ...ix,
              title: `${
                ix.programName ?? displayAddress(ix.ix.programId.toString())
              }: ${startCase(
                (ix.parsed && "name" in ix.parsed ? ix.parsed.name : null) ??
                  "Unknown Instruction"
              )}`,
            })
          );
      return { tx: txData, index, instructions };
    },
    {
      enabled: !!txData,
    }
  );
  return { ...query, isLoading: query.isLoading || loading };
};
