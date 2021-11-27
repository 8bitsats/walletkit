import type { Program } from "@project-serum/anchor";
import type { InstructionDisplay } from "@project-serum/anchor/dist/cjs/coder/instruction";
import type { IdlType } from "@project-serum/anchor/dist/esm/idl";
import type { TransactionInstruction } from "@solana/web3.js";

export const formatIdlType = (idlType: IdlType): string => {
  if (typeof idlType === "string") {
    return idlType as string;
  }

  if ("vec" in idlType) {
    return `Vec<${formatIdlType(idlType.vec)}>`;
  }
  if ("option" in idlType) {
    return `Option<${formatIdlType(idlType.option)}>`;
  }
  if ("defined" in idlType) {
    return idlType.defined;
  }
  if ("array" in idlType) {
    return `Array<${formatIdlType(idlType.array[0])}; ${idlType.array[1]}>`;
  }

  throw new Error(`Unknown IDL type: ${JSON.stringify(idlType)}`);
};

/**
 * Parses and formats a raw transaction instruction.
 * @returns
 */
export const formatTxInstruction = ({
  program,
  txInstruction,
}: {
  program: Program;
  txInstruction: TransactionInstruction;
}): InstructionDisplay => {
  const decoded = program.coder.instruction.decode(txInstruction.data);
  if (!decoded) {
    throw new Error("could not decode ix data");
  }
  const fmt = program.coder.instruction.format(decoded, txInstruction.keys);
  if (!fmt) {
    throw new Error("invalid instruction");
  }
  return fmt;
};
