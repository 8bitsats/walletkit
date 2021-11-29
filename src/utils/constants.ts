import { PublicKey } from "@solana/web3.js";

export const TX_REFETCH_TIME = 1_000;

export const API_BASE = `https://api.saber.so/api/v1`;

export enum Tags {
  DecimalWrapped = "saber-decimal-wrapped",
}

// these are all derived from each other.
export const BANK_KEY = new PublicKey(
  "G6smmw1wU7UC4oZmdxWvXjhesJib9GvjwRbQQePV3U4L"
);

export const SABER_REWARDER_KEY = new PublicKey(
  "rXhAofQCT7NN9TUqigyEAUzV1uLL4boeD8CRkNBSkYk"
);

export const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);
