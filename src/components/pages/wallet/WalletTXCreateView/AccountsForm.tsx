import type { IdlAccountItem } from "@project-serum/anchor/dist/esm/idl";

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
    <div tw="grid gap-1">
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
          <div tw="grid gap-1">
            <span>{account.name}</span>
            <input
              key={account.name}
              type="string"
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
