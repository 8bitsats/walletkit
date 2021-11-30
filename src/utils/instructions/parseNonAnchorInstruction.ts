import { TOKEN_PROGRAM_ID } from "@saberhq/token-utils";
import type { TransactionInstruction } from "@solana/web3.js";

import { MEMO_PROGRAM_ID } from "../constants";
import type { TokenInstructionInner } from "./token/parsers";
import { parseTokenInstruction } from "./token/parsers";
import type { TokenInstructionType } from "./token/types";
import { IX_TITLES } from "./token/types";

export type MemoInstruction = {
  program: "memo";
  text: string;
};

export type TokenInstruction<
  K extends TokenInstructionType = TokenInstructionType
> = TokenInstructionInner & {
  program: "token";
  type: K;
};

type ParsedNonAnchorInstructionInner = MemoInstruction | TokenInstruction;

export type ParsedNonAnchorInstruction<
  T extends ParsedNonAnchorInstructionInner = ParsedNonAnchorInstructionInner
> = T & {
  name: string;
  accountLabels?: string[];
};

type IXParser = (ix: TransactionInstruction) => ParsedNonAnchorInstruction;

export const PARSERS: Record<string, IXParser> = {
  [MEMO_PROGRAM_ID.toString()]: (
    ix
  ): ParsedNonAnchorInstruction<MemoInstruction> => {
    const text = ix.data.toString("utf-8");
    return { text, name: "Memo", program: "memo" };
  },
  [TOKEN_PROGRAM_ID.toString()]: (
    ix
  ): ParsedNonAnchorInstruction<TokenInstruction> => {
    const result = parseTokenInstruction(ix);
    const name = IX_TITLES[result.type];
    return { ...result, name, program: "token" };
  },
};

export const parseNonAnchorInstruction = (
  ix: TransactionInstruction
): ParsedNonAnchorInstruction | null => {
  const parser = PARSERS[ix.programId.toString()];
  if (!parser) {
    return null;
  }
  return parser(ix);
};
