import { utils } from "@project-serum/anchor";
import type { Message } from "@solana/web3.js";
import invariant from "tiny-invariant";

import { InstructionCard } from "./InstructionCard";

interface Props {
  message: Message;
}

export const InstructionsSection: React.FC<Props> = ({ message }: Props) => {
  return (
    <>
      {message.instructions.map((ix, index) => {
        const programId = message.accountKeys[ix.programIdIndex];
        const accountMetas = ix.accounts.map((accountIndex) => {
          const accountId = message.accountKeys[accountIndex];
          invariant(accountId);
          return {
            pubkey: accountId,
            isSigner: accountIndex < message.header.numRequiredSignatures,
            isWritable: message.isAccountWritable(accountIndex),
          };
        });
        const theIX = programId
          ? {
              programId,
              keys: accountMetas,
              data: utils.bytes.bs58.decode(ix.data),
            }
          : null;
        invariant(theIX);
        return <InstructionCard key={index} ix={theIX} index={index} />;
      })}
    </>
  );
};
