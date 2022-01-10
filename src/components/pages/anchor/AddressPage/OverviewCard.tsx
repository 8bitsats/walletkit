import type { KeyedAccountInfo } from "@solana/web3.js";

import { AddressLink } from "../../../common/AddressLink";
import { TableCardBody } from "../../../common/card/TableCardBody";
import { Card } from "../../../common/governance/Card";
import { ProgramLabel } from "../../../common/program/ProgramLabel";
import { SolAmount } from "../../../common/program/SolAmount";

interface Props {
  account: KeyedAccountInfo;
}

export const OverviewCard: React.FC<Props> = ({ account }: Props) => {
  return (
    <Card title="Overview" tw="pb-2">
      <div tw="whitespace-nowrap overflow-x-auto">
        <TableCardBody>
          <tr>
            <td>Address</td>
            <td>
              <div tw="flex flex-col items-end">
                <AddressLink address={account.accountId} />
              </div>
            </td>
          </tr>
          <tr>
            <td>Balance (SOL)</td>
            <td>
              <div tw="flex flex-col items-end">
                <SolAmount lamports={account.accountInfo.lamports} />
              </div>
            </td>
          </tr>
          <tr>
            <td>Allocated Data Size</td>
            <td>
              <div tw="flex flex-col items-end">
                {account.accountInfo.data.length} byte(s)
              </div>
            </td>
          </tr>
          <tr>
            <td>Assigned Program Id</td>
            <td>
              <div tw="flex flex-col items-end">
                <ProgramLabel
                  address={account.accountInfo.owner}
                  showCopy
                  showRaw={false}
                  shorten={false}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>Executable</td>
            <td>
              <div tw="flex flex-col items-end">
                {account.accountInfo.executable ? "Yes" : "No"}
              </div>
            </td>
          </tr>
        </TableCardBody>
      </div>
    </Card>
  );
};
