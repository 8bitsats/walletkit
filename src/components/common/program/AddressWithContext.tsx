import { ACCOUNT_DISCRIMINATOR_SIZE } from "@project-serum/anchor/dist/cjs/coder";
import { SuperCoder } from "@saberhq/anchor-contrib";
import { useAccountData } from "@saberhq/sail";
import type { KeyedAccountInfo, PublicKey } from "@solana/web3.js";
import { SystemProgram } from "@solana/web3.js";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import { useIDL } from "../../../hooks/useIDLs";
import { SYSVAR_OWNER } from "../../../utils/programs";
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
  const info = useAccountData(pubkey);
  return (
    <div tw="flex items-end flex-col gap-0.5">
      {info.data?.accountInfo.executable ? (
        <ProgramLabel
          address={pubkey}
          showCopy
          showRaw={false}
          shorten={false}
        />
      ) : (
        <AddressLink
          tw="dark:text-primary hover:text-opacity-80 font-mono"
          address={pubkey}
          showCopy
          showRaw={false}
          shorten={false}
        />
      )}
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
  const { data: idl } = useIDL(info.data?.accountInfo.owner);

  const accountName = useMemo(() => {
    if (!idl?.idl || !info.data) {
      return null;
    }
    const discriminator = info.data.accountInfo.data
      .slice(0, ACCOUNT_DISCRIMINATOR_SIZE)
      .toString("hex");
    const sc = new SuperCoder(idl.programID, idl.idl);
    return sc.discriminators[discriminator] ?? null;
  }, [idl?.idl, idl?.programID, info.data]);

  if (!info.data) {
    if (info.loading) {
      return (
        <span tw="text-gray-300">
          <span className="spinner-grow spinner-grow-sm me-2"></span>
          Loading
        </span>
      );
    } else {
      return <span>Account not found</span>;
    }
  }

  const errorMessage = validator && validator(info.data);
  if (errorMessage) return <span tw="text-accent">{errorMessage}</span>;

  if (info.data.accountInfo.executable) {
    return <span tw="text-gray-300">Executable Program</span>;
  }

  const owner = info.data.accountInfo.owner;

  return (
    <span tw="text-gray-300">
      {owner ? (
        <>
          {owner.equals(SYSVAR_OWNER) ? (
            "Sysvar."
          ) : (
            <>
              {accountName ? (
                <>
                  <Link
                    tw="text-primary hover:text-white transition-colors"
                    to={`/address/${info.data.accountId.toString()}`}
                  >
                    {accountName}
                  </Link>{" "}
                  o
                </>
              ) : (
                "O"
              )}
              wned by <ProgramLabel address={owner} />.
            </>
          )}{" "}
          Balance is <SolAmount lamports={info.data.accountInfo.lamports} />.
        </>
      ) : (
        "Account doesn't exist"
      )}
    </span>
  );
};
