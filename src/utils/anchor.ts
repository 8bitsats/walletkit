import { QUARRY_ADDRESSES } from "@quarryprotocol/quarry-sdk";
import { TOKEN_PROGRAM_ID } from "@saberhq/token-utils";
import type { PublicKey } from "@solana/web3.js";
import {
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_STAKE_HISTORY_PUBKEY,
} from "@solana/web3.js";

export const COMMON_ACCOUNTS: Record<string, PublicKey> = {
  systemProgram: SystemProgram.programId,
  tokenProgram: TOKEN_PROGRAM_ID,
  clock: SYSVAR_CLOCK_PUBKEY,
  unusedClock: SYSVAR_CLOCK_PUBKEY,
  rent: SYSVAR_RENT_PUBKEY,
  stakeHistory: SYSVAR_STAKE_HISTORY_PUBKEY,
  quarryMineProgram: QUARRY_ADDRESSES.Mine,
  mineProgram: QUARRY_ADDRESSES.Mine,
  mintWrapperProgram: QUARRY_ADDRESSES.MintWrapper,
};
