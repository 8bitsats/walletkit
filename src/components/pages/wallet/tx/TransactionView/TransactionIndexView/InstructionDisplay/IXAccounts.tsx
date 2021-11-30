import type { PublicKey } from "@solana/web3.js";

import { AddressLink } from "../../../../../../common/AddressLink";

interface Props {
  accounts: {
    name?: string;
    pubkey: PublicKey;
    isSigner: boolean;
    isWritable: boolean;
  }[];
}

export const IXAccounts: React.FC<Props> = ({ accounts }: Props) => {
  return (
    <div tw="border rounded text-sm">
      <h2 tw="px-6 py-2 font-semibold text-gray-800">
        Accounts ({accounts.length})
      </h2>
      {accounts.map((account, i) => {
        return (
          <div
            key={`account_${i}`}
            tw="px-6 py-2 flex items-center justify-between border-t border-t-gray-150"
          >
            <div tw="flex items-center gap-4">
              <span tw="text-gray-500 font-semibold">
                {account.name ?? `Account #${i}`}
              </span>
              <div tw="flex items-center gap-2">
                {account.isWritable && (
                  <div tw="border text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-2">
                    <div tw="h-2 w-2 bg-primary rounded-full" />
                    <span>writable</span>
                  </div>
                )}
                {account.isSigner && (
                  <div tw="border text-gray-500 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-2">
                    <div tw="h-2 w-2 bg-accent rounded-full" />
                    <span>signer</span>
                  </div>
                )}
              </div>
            </div>
            <div tw="text-gray-800 font-medium">
              <AddressLink address={account.pubkey} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
