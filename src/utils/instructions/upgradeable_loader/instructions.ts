// https://github.com/solana-labs/solana/blob/master/sdk/program/src/loader_upgradeable_instruction.rs

import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";

import { makeUpgradeableLoaderInstructionData } from "./parsers";

export const BPF_UPGRADEABLE_LOADER_ID = new PublicKey(
  "BPFLoaderUpgradeab1e11111111111111111111111"
);

interface Upgrade {
  program: PublicKey;
  buffer: PublicKey;
  spill: PublicKey;
  signer: PublicKey;
}

/**
 * Upgrade a program.
 *
 * A program can be updated as long as the program's authority has not been
 * set to `None`.
 *
 * The Buffer account must contain sufficient lamports to fund the
 * ProgramData account to be rent-exempt, any additional lamports left over
 * will be transferred to the spill account, leaving the Buffer account
 * balance at zero.
 *
 * # Account references
 *   0. `[writable]` The ProgramData account.
 *   1. `[writable]` The Program account.
 *   2. `[writable]` The Buffer account where the program data has been
 *      written.  The buffer account's authority must match the program's
 *      authority
 *   3. `[writable]` The spill account.
 *   4. `[]` Rent sysvar.
 *   5. `[]` Clock sysvar.
 *   6. `[signer]` The program's authority.
 */
export const createUpgradeInstruction = async ({
  program,
  buffer,
  spill,
  signer,
}: Upgrade): Promise<TransactionInstruction> => {
  const [programData] = await PublicKey.findProgramAddress(
    [program.toBuffer()],
    BPF_UPGRADEABLE_LOADER_ID
  );
  return new TransactionInstruction({
    programId: BPF_UPGRADEABLE_LOADER_ID,
    data: makeUpgradeableLoaderInstructionData("upgrade"),
    keys: [
      {
        pubkey: programData,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: program,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: buffer,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: spill,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SYSVAR_CLOCK_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: signer,
        isSigner: true,
        isWritable: false,
      },
    ],
  });
};
