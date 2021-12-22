import { useTokens } from "@quarryprotocol/react-quarry";
import { useAccountData } from "@saberhq/sail";
import {
  deserializeAccount,
  getATAAddress,
  RAW_SOL,
  TOKEN_PROGRAM_ID,
  TokenAmount,
} from "@saberhq/token-utils";
import { useSolana } from "@saberhq/use-solana";
import type { PublicKey } from "@solana/web3.js";
import { SystemProgram } from "@solana/web3.js";
import { useMemo } from "react";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";

export interface TokenAccountWithInfo {
  account: PublicKey;
  balance: TokenAmount;
  isATA: boolean;
}

/**
 * Fetches the token accounts of the provided address.
 * @param address
 * @returns
 */
export const useTokenAccounts = (address: PublicKey | null | undefined) => {
  const { connection, network } = useSolana();
  const nativeBalance = useAccountData(address);
  const tokenAccountsRaw = useQuery(
    ["tokenAccountsRaw", network, address?.toString()],
    async () => {
      invariant(address, "address");
      const raw = await connection.getTokenAccountsByOwner(address, {
        programId: TOKEN_PROGRAM_ID,
      });
      return await Promise.all(
        raw.value.map(async ({ pubkey, account }) => {
          const parsed = deserializeAccount(account.data);
          const ataAddress = await getATAAddress({
            mint: parsed.mint,
            owner: parsed.owner,
          });
          return {
            account: pubkey,
            mint: parsed.mint,
            balance: parsed.amount,
            isATA: ataAddress.equals(pubkey),
          };
        })
      );
    },
    {
      enabled: !!address,
    }
  );
  const tokens = useTokens(
    useMemo(
      () => tokenAccountsRaw.data?.map((ta) => ta.mint),
      [tokenAccountsRaw.data]
    )
  );
  return useQuery(
    ["tokenAccounts", network, address?.toString()],
    (): TokenAccountWithInfo[] => {
      invariant(address, "address");
      const sol =
        nativeBalance.data &&
        // only show SOL balance if the account is normal
        nativeBalance.data.accountInfo.owner.equals(SystemProgram.programId)
          ? {
              account: nativeBalance.data.accountId,
              balance: new TokenAmount(
                RAW_SOL[network],
                nativeBalance.data.accountInfo.lamports
              ),
              isATA: false,
            }
          : null;
      const result = tokenAccountsRaw.data?.map(
        ({ mint, balance, ...taRest }) => {
          const token = tokens.find(
            (token) =>
              token?.mintAccount.equals(mint) && token.network === network
          );
          if (!token) {
            return null;
          }
          return {
            ...taRest,
            balance: new TokenAmount(token, balance),
          };
        }
      );
      return [
        ...(sol ? [sol] : []),
        ...(result?.filter((r): r is TokenAccountWithInfo => !!r) ?? []),
      ];
    },
    {
      enabled:
        !nativeBalance.loading &&
        nativeBalance.data !== undefined &&
        !!address &&
        tokens.every((t) => t !== undefined) &&
        tokenAccountsRaw.isFetched,
    }
  );
};

/**
 * Fetches the token accounts of the currently connected user.
 * @returns
 */
export const useUserTokenAccounts = () => {
  const { providerMut } = useSolana();
  return useTokenAccounts(providerMut ? providerMut.wallet.publicKey : null);
};
