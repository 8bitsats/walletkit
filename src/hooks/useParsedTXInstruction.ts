import { SuperCoder } from "@saberhq/anchor-contrib";
import type { ProposalInstruction } from "@tribecahq/tribeca-sdk";
import { startCase } from "lodash";
import { useMemo } from "react";

import { parseNonAnchorInstruction } from "../utils/instructions/parseNonAnchorInstruction";
import { displayAddress, programLabel } from "../utils/programs";
import { useIDL } from "./useIDLs";

export const useParsedTXInstruction = (rawIx: ProposalInstruction) => {
  const { data: idl } = useIDL(rawIx.programId);
  const label = programLabel(rawIx.programId.toString());
  const ix = useMemo(() => {
    const ix = { ...rawIx, data: Buffer.from(rawIx.data) };
    if (idl?.idl) {
      const superCoder = new SuperCoder(rawIx.programId, {
        ...idl.idl,
        instructions: idl.idl.instructions.concat(idl.idl.state?.methods ?? []),
      });
      return {
        programName: label ?? startCase(idl.idl.name),
        ix,
        parsed: { ...superCoder.parseInstruction(ix), anchor: true },
      };
    }
    const parsedNonAnchor = parseNonAnchorInstruction(ix);
    return { ix, programName: label, parsed: parsedNonAnchor };
  }, [idl, label, rawIx]);
  const title = `${
    ix.programName ?? displayAddress(ix.ix.programId.toString())
  }: ${startCase(
    (ix.parsed && "name" in ix.parsed ? ix.parsed.name : null) ??
      "Unknown Instruction"
  )}`;
  return {
    ...ix,
    title,
  };
};
