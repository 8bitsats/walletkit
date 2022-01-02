import { useAccountData } from "@saberhq/sail";
import type { KeyedAccountInfo, PublicKey } from "@solana/web3.js";
import { SystemProgram } from "@solana/web3.js";
import React from "react";

import { AddressLink } from "../AddressLink";
import { ProgramLabel } from "./ProgramLabel";
import { SolAmount } from "./SolAmount";

type AccountValidator = (account: KeyedAccountInfo) => string | undefined;

export const createFeePayerValidator = (
  feeLamports: number
): AccountValidator => {
  return (account: KeyedAccountInfo): string | undefined => {
    if (!account.accountInfo.owner.equals(SystemProgram.programId))
      return "Only system-owned accounts can pay fees";
    // TODO: Actually nonce accounts can pay fees too
    if (account.accountInfo.data.length > 0)
      return "Only unallocated accounts can pay fees";
    if (account.accountInfo.lamports < feeLamports) {
      return "Insufficient funds for fees";
    }
    return;
  };
};

export const programValidator = (
  account: KeyedAccountInfo
): string | undefined => {
  if (!account.accountInfo.executable)
    return "Only executable accounts can be invoked";
  return;
};

interface Props {
  pubkey: PublicKey;
  validator?: AccountValidator;
}

export const AddressWithContext = ({ pubkey, validator }: Props) => {
  return (
    <div tw="flex items-end flex-col gap-0.5">
      <AddressLink
        tw="dark:text-primary hover:text-opacity-80 font-mono"
        address={pubkey}
        showCopy
        showRaw={false}
        shorten={false}
      />
      <AccountInfo pubkey={pubkey} validator={validator} />
    </div>
  );
};

interface Props {
  pubkey: PublicKey;
  validator?: AccountValidator;
}

export const AccountInfo = ({ pubkey, validator }: Props) => {
  const info = useAccountData(pubkey);

  if (!info.data) {
    if (info.loading) {
      return (
        <span className="text-muted">
          <span className="spinner-grow spinner-grow-sm me-2"></span>
          Loading
        </span>
      );
    } else {
      return <span>Account not found</span>;
    }
  }

  const errorMessage = validator && validator(info.data);
  if (errorMessage) return <span className="text-warning">{errorMessage}</span>;

  if (info.data.accountInfo.executable) {
    return <span className="text-muted">Executable Program</span>;
  }

  const owner = info.data.accountInfo.owner;

  return (
    <span className="text-muted">
      {owner ? (
        <>
          Owned by <ProgramLabel address={owner} />. Balance is{" "}
          <SolAmount lamports={info.data.accountInfo.lamports} />.
        </>
      ) : (
        "Account doesn't exist"
      )}
    </span>
  );
};
