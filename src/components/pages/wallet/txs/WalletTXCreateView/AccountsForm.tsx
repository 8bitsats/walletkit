import type { IdlAccountItem } from "@project-serum/anchor/dist/esm/idl";
import { startCase } from "lodash";

interface Props {
  accountItems: IdlAccountItem[];
  accountsStrs: Record<string, string>;
  prefix: string;
  onChange: (path: string, key: string) => void;
}

export const AccountsForm: React.FC<Props> = ({
  accountItems,
  accountsStrs,
  prefix,
  onChange,
}: Props) => {
  return (
    <div tw="grid gap-2">
      {accountItems.map((account) =>
        "accounts" in account ? (
          <div tw="border p-4">
            <span>{account.name}</span>
            <div>
              <AccountsForm
                accountItems={account.accounts}
                accountsStrs={accountsStrs}
                prefix={`${account.name}.`}
                onChange={onChange}
              />
            </div>
          </div>
        ) : (
          <div tw="grid gap-1 grid-cols-2">
            <div tw="flex items-center gap-2">
              <span>{startCase(account.name)}</span>
              {account.isMut && (
                <span tw="rounded bg-primary text-white px-1 py-0.5">
                  writable
                </span>
              )}
              {account.isSigner && (
                <span tw="rounded bg-accent text-white px-1 py-0.5">
                  signer
                </span>
              )}
            </div>
            <input
              key={account.name}
              type="text"
              placeholder={account.name}
              value={accountsStrs[`${prefix}${account.name}`] ?? ""}
              onChange={(e) => {
                onChange(`${prefix}${account.name}`, e.target.value);
              }}
            />
          </div>
        )
      )}
    </div>
  );
};
