import type { TokenInfo } from "@saberhq/token-utils";
import {
  BPF_LOADER_DEPRECATED_PROGRAM_ID,
  BPF_LOADER_PROGRAM_ID,
  PublicKey,
  Secp256k1Program,
  StakeProgram,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_REWARDS_PUBKEY,
  SYSVAR_STAKE_HISTORY_PUBKEY,
  VOTE_PROGRAM_ID,
} from "@solana/web3.js";

import { shortenAddress } from "./utils";

export type ProgramName =
  typeof PROGRAM_NAME_BY_ID[keyof typeof PROGRAM_NAME_BY_ID];

export enum PROGRAM_NAMES {
  // native built-ins
  ADDRESS_MAP = "Address Map Program",
  CONFIG = "Config Program",
  STAKE = "Stake Program",
  SYSTEM = "System Program",
  VOTE = "Vote Program",
  SECP256K1 = "Secp256k1 Program",

  // spl
  ASSOCIATED_TOKEN = "Associated Token Program",
  FEATURE_PROPOSAL = "Feature Proposal Program",
  LENDING = "Lending Program",
  MEMO = "Memo Program",
  MEMO_2 = "Memo Program v2",
  NAME = "Name Service Program",
  STAKE_POOL = "Stake Pool Program",
  SWAP = "Swap Program",
  TOKEN = "Token Program",
  TOKEN_METADATA = "Token Metadata Program",
  TOKEN_VAULT = "Token Vault Program",

  // other
  ACUMEN = "Acumen Program",
  BONFIDA_POOL = "Bonfida Pool Program",
  BREAK_SOLANA = "Break Solana Program",
  MANGO_GOVERNANCE = "Mango Governance Program",
  MANGO_ICO = "Mango ICO Program",
  MANGO_1 = "Mango Program v1",
  MANGO_2 = "Mango Program v2",
  MANGO_3 = "Mango Program v3",
  MARINADE = "Marinade Staking Program",
  MERCURIAL = "Mercurial Stable Swap Program",
  METAPLEX = "Metaplex Program",
  NFT_AUCTION = "NFT Auction Program",
  NFT_CANDY_MACHINE = "NFT Candy Machine Program",
  ORCA_SWAP_1 = "Orca Swap Program v1",
  ORCA_SWAP_2 = "Orca Swap Program v2",
  ORCA_AQUAFARM = "Orca Aquafarm Program",
  PORT = "Port Finance Program",
  PYTH = "Pyth Oracle Program",
  QUARRY_MERGE_MINE = "Quarry Merge Mine",
  QUARRY_MINE = "Quarry Mine",
  QUARRY_MINT_WRAPPER = "Quarry Mint Wrapper",
  QUARRY_REDEEMER = "Quarry Redeemer",
  QUARRY_REGISTRY = "Quarry Registry",
  RAYDIUM_AMM = "Raydium AMM Program",
  RAYDIUM_IDO = "Raydium IDO Program",
  RAYDIUM_LP_1 = "Raydium Liquidity Pool Program v1",
  RAYDIUM_LP_2 = "Raydium Liquidity Pool Program v2",
  RAYDIUM_STAKING = "Raydium Staking Program",
  SABER_ROUTER = "Saber Router Program",
  SABER_SWAP = "Saber Stable Swap Program",
  SERUM_1 = "Serum Dex Program v1",
  SERUM_2 = "Serum Dex Program v2",
  SERUM_3 = "Serum Dex Program v3",
  SERUM_SWAP = "Serum Swap Program",
  SOLEND = "Solend Program",
  SOLIDO = "Lido for Solana Program",
  STEP_SWAP = "Step Finance Swap Program",
  SWITCHBOARD = "Switchboard Oracle Program",
  WORMHOLE = "Wormhole",
}

export const PROGRAM_NAME_BY_ID = {
  // native built-ins
  AddressMap111111111111111111111111111111111: PROGRAM_NAMES.ADDRESS_MAP,
  Config1111111111111111111111111111111111111: PROGRAM_NAMES.CONFIG,
  [StakeProgram.programId.toBase58()]: PROGRAM_NAMES.STAKE,
  [SystemProgram.programId.toBase58()]: PROGRAM_NAMES.SYSTEM,
  [VOTE_PROGRAM_ID.toBase58()]: PROGRAM_NAMES.VOTE,
  [Secp256k1Program.programId.toBase58()]: PROGRAM_NAMES.SECP256K1,

  // spl
  ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL: PROGRAM_NAMES.ASSOCIATED_TOKEN,
  Feat1YXHhH6t1juaWF74WLcfv4XoNocjXA6sPWHNgAse: PROGRAM_NAMES.FEATURE_PROPOSAL,
  LendZqTs7gn5CTSJU1jWKhKuVpjJGom45nnwPb2AMTi: PROGRAM_NAMES.LENDING,
  Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo: PROGRAM_NAMES.MEMO,
  MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr: PROGRAM_NAMES.MEMO_2,
  namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX: PROGRAM_NAMES.NAME,
  SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy: PROGRAM_NAMES.STAKE_POOL,
  SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8: PROGRAM_NAMES.SWAP,
  TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA: PROGRAM_NAMES.TOKEN,
  metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s: PROGRAM_NAMES.TOKEN_METADATA,
  vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn: PROGRAM_NAMES.TOKEN_VAULT,

  // other
  C64kTdg1Hzv5KoQmZrQRcm2Qz7PkxtFBgw7EpFhvYn8W: PROGRAM_NAMES.ACUMEN,
  WvmTNLpGMVbwJVYztYL4Hnsy82cJhQorxjnnXcRm3b6: PROGRAM_NAMES.BONFIDA_POOL,
  BrEAK7zGZ6dM71zUDACDqJnekihmwF15noTddWTsknjC: PROGRAM_NAMES.BREAK_SOLANA,
  GqTPL6qRf5aUuqscLh8Rg2HTxPUXfhhAXDptTLhp1t2J: PROGRAM_NAMES.MANGO_GOVERNANCE,
  "7sPptkymzvayoSbLXzBsXEF8TSf3typNnAWkrKrDizNb": PROGRAM_NAMES.MANGO_ICO,
  JD3bq9hGdy38PuWQ4h2YJpELmHVGPPfFSuFkpzAd9zfu: PROGRAM_NAMES.MANGO_1,
  "5fNfvyp5czQVX77yoACa3JJVEhdRaWjPuazuWgjhTqEH": PROGRAM_NAMES.MANGO_2,
  mv3ekLzLbnVPNxjSKvqBpU3ZeZXPQdEC3bp5MDEBG68: PROGRAM_NAMES.MANGO_3,
  MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD: PROGRAM_NAMES.MARINADE,
  MERLuDFBMmsHnsBPZw2sDQZHvXFMwp8EdjudcU2HKky: PROGRAM_NAMES.MERCURIAL,
  p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98: PROGRAM_NAMES.METAPLEX,
  auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8: PROGRAM_NAMES.NFT_AUCTION,
  cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ: PROGRAM_NAMES.NFT_CANDY_MACHINE,
  DjVE6JNiYqPL2QXyCUUh8rNjHrbz9hXHNYt99MQ59qw1: PROGRAM_NAMES.ORCA_SWAP_1,
  "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP": PROGRAM_NAMES.ORCA_SWAP_2,
  "82yxjeMsvaURa4MbZZ7WZZHfobirZYkH1zF8fmeGtyaQ": PROGRAM_NAMES.ORCA_AQUAFARM,
  Port7uDYB3wk6GJAw4KT1WpTeMtSu9bTcChBHkX2LfR: PROGRAM_NAMES.PORT,
  FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH: PROGRAM_NAMES.PYTH,
  QMMD16kjauP5knBwxNUJRZ1Z5o3deBuFrqVjBVmmqto: PROGRAM_NAMES.QUARRY_MERGE_MINE,
  QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB: PROGRAM_NAMES.QUARRY_MINE,
  QMWoBmAyJLAsA1Lh9ugMTw2gciTihncciphzdNzdZYV:
    PROGRAM_NAMES.QUARRY_MINT_WRAPPER,
  QRDxhMw1P2NEfiw5mYXG79bwfgHTdasY2xNP76XSea9: PROGRAM_NAMES.QUARRY_REDEEMER,
  QREGBnEj9Sa5uR91AV8u3FxThgP5ZCvdZUW2bHAkfNc: PROGRAM_NAMES.QUARRY_REGISTRY,
  "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": PROGRAM_NAMES.RAYDIUM_AMM,
  "9HzJyW1qZsEiSfMUf6L2jo3CcTKAyBmSyKdwQeYisHrC": PROGRAM_NAMES.RAYDIUM_IDO,
  RVKd61ztZW9GUwhRbbLoYVRE5Xf1B2tVscKqwZqXgEr: PROGRAM_NAMES.RAYDIUM_LP_1,
  "27haf8L6oxUeXrHrgEgsexjSY5hbVUWEmvv9Nyxg8vQv": PROGRAM_NAMES.RAYDIUM_LP_2,
  EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q: PROGRAM_NAMES.RAYDIUM_STAKING,
  Crt7UoUR6QgrFrN7j8rmSQpUTNWNSitSwWvsWGf1qZ5t: PROGRAM_NAMES.SABER_ROUTER,
  SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ: PROGRAM_NAMES.SABER_SWAP,
  BJ3jrUzddfuSrZHXSCxMUUQsjKEyLmuuyZebkcaFp2fg: PROGRAM_NAMES.SERUM_1,
  EUqojwWA2rd19FZrzeBncJsm38Jm1hEhE3zsmX3bRc2o: PROGRAM_NAMES.SERUM_2,
  "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin": PROGRAM_NAMES.SERUM_3,
  "22Y43yTVxuUkoRKdm9thyRhQ3SdgQS7c7kB6UNCiaczD": PROGRAM_NAMES.SERUM_SWAP,
  So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo: PROGRAM_NAMES.SOLEND,
  CrX7kMhLC3cSsXJdT7JDgqrRVWGnUpX3gfEfxxU2NVLi: PROGRAM_NAMES.SOLIDO,
  SSwpMgqNDsyV7mAgN9ady4bDVu5ySjmmXejXvy2vLt1: PROGRAM_NAMES.STEP_SWAP,
  DtmE9D2CSB4L5D6A15mraeEjrGMm6auWVzgaD8hK2tZM: PROGRAM_NAMES.SWITCHBOARD,
  WormT3McKhFJ2RkiGpdw9GKvNCrB2aB54gb2uV9MfQC: PROGRAM_NAMES.WORMHOLE,
} as const;

export type LoaderName = typeof LOADER_IDS[keyof typeof LOADER_IDS];
export const LOADER_IDS = {
  MoveLdr111111111111111111111111111111111111: "Move Loader",
  NativeLoader1111111111111111111111111111111: "Native Loader",
  [BPF_LOADER_DEPRECATED_PROGRAM_ID.toBase58()]: "BPF Loader",
  [BPF_LOADER_PROGRAM_ID.toBase58()]: "BPF Loader 2",
  BPFLoaderUpgradeab1e11111111111111111111111: "BPF Upgradeable Loader",
} as const;

export const SYSVAR_OWNER = new PublicKey(
  "Sysvar1111111111111111111111111111111111111"
);

export const SPECIAL_IDS: { [key: string]: string } = {
  "1nc1nerator11111111111111111111111111111111": "Incinerator",
  Sysvar1111111111111111111111111111111111111: "SYSVAR",
};

export const SYSVAR_IDS = {
  [SYSVAR_CLOCK_PUBKEY.toBase58()]: "Sysvar: Clock",
  SysvarEpochSchedu1e111111111111111111111111: "Sysvar: Epoch Schedule",
  SysvarFees111111111111111111111111111111111: "Sysvar: Fees",
  SysvarRecentB1ockHashes11111111111111111111: "Sysvar: Recent Blockhashes",
  [SYSVAR_RENT_PUBKEY.toBase58()]: "Sysvar: Rent",
  [SYSVAR_REWARDS_PUBKEY.toBase58()]: "Sysvar: Rewards",
  SysvarS1otHashes111111111111111111111111111: "Sysvar: Slot Hashes",
  SysvarS1otHistory11111111111111111111111111: "Sysvar: Slot History",
  [SYSVAR_STAKE_HISTORY_PUBKEY.toBase58()]: "Sysvar: Stake History",
  Sysvar1nstructions1111111111111111111111111: "Sysvar: Instructions",
};

export function programLabel(address: string): string | undefined {
  const programName = PROGRAM_NAME_BY_ID[address];
  return programName ?? LOADER_IDS[address];
}

export function tokenLabel(
  address: string,
  tokenRegistry?: Map<string, TokenInfo>
): string | undefined {
  if (!tokenRegistry) return;
  const tokenInfo = tokenRegistry.get(address);
  if (!tokenInfo) return;
  if (tokenInfo.name === tokenInfo.symbol) {
    return tokenInfo.name;
  }
  return `${tokenInfo.symbol} - ${tokenInfo.name}`;
}

export function addressLabel(
  address: string,
  tokenRegistry?: Map<string, TokenInfo>
): string | undefined {
  return (
    programLabel(address) ||
    SYSVAR_IDS[address] ||
    SPECIAL_IDS[address] ||
    tokenLabel(address, tokenRegistry)
  );
}

export function displayAddress(address: string, shorten = true): string {
  return addressLabel(address) ?? (shorten ? shortenAddress(address) : address);
}
