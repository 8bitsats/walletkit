import type { Idl } from "@project-serum/anchor";
import { AccountsCoder, Coder } from "@project-serum/anchor";
import { ACCOUNT_DISCRIMINATOR_SIZE } from "@project-serum/anchor/dist/cjs/coder";
import { formatIdlType } from "@saberhq/anchor-contrib";
import type { KeyedAccountInfo } from "@solana/web3.js";
import { startCase } from "lodash";
import { useMemo } from "react";

import { TableCardBody } from "../../../common/card/TableCardBody";
import { DisplayValue } from "../../../common/DisplayValue";
import { Card } from "../../../common/governance/Card";

interface Props {
  account: KeyedAccountInfo;
  idl: Idl;
}

export const AnchorDataCard: React.FC<Props> = ({ account, idl }: Props) => {
  const { accountName, decoded } = useMemo(() => {
    const parser = new Coder(idl);
    const discriminators = idl.accounts?.map((account) => ({
      name: account.name,
      discriminator: AccountsCoder.accountDiscriminator(account.name),
    }));

    const discriminator = account.accountInfo.data.slice(
      0,
      ACCOUNT_DISCRIMINATOR_SIZE
    );

    const accountName = discriminators?.find((d) =>
      d.discriminator.equals(discriminator)
    );
    if (!accountName) {
      return { accountName: null, decoded: null };
    }

    const decoded: Record<string, unknown> | null = parser.accounts.decode(
      accountName.name,
      account.accountInfo.data
    );

    return { accountName: accountName.name, decoded };
  }, [account.accountInfo.data, idl]);

  if (!accountName) {
    return null;
  }

  const idlAccount = idl.accounts?.find(
    (account) => account.name === accountName
  );
  if (!idlAccount) {
    return null;
  }

  return (
    <Card title={`Anchor Data: ${startCase(accountName)}`}>
      <div tw="whitespace-nowrap overflow-x-auto">
        <TableCardBody>
          {decoded
            ? Object.entries(decoded).map(([k, v]) => {
                const idlType =
                  idlAccount.type.kind === "struct"
                    ? idlAccount.type.fields?.find((f) => f.name === k)?.type
                    : null;
                return (
                  <tr key={k}>
                    <td>
                      <div tw="flex flex-col gap-1">
                        <span tw="font-medium">{startCase(k)}</span>
                        {idlType && (
                          <span tw="text-warmGray-300">
                            {formatIdlType(idlType)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div tw="flex flex-col items-end">
                        <DisplayValue value={v} />
                      </div>
                    </td>
                  </tr>
                );
              })
            : null}
        </TableCardBody>
      </div>
    </Card>
  );
};
