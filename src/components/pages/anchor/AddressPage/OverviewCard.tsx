import { useSolana } from "@saberhq/use-solana";
import type { KeyedAccountInfo } from "@solana/web3.js";
import tw from "twin.macro";

import { AddressLink } from "../../../common/AddressLink";
import { Button } from "../../../common/Button";
import { TableCardBody } from "../../../common/card/TableCardBody";
import { Card } from "../../../common/governance/Card";
import { ProgramLabel } from "../../../common/program/ProgramLabel";
import { SolAmount } from "../../../common/program/SolAmount";

interface Props {
  account: KeyedAccountInfo;
}

export const OverviewCard: React.FC<Props> = ({ account }: Props) => {
  const { network } = useSolana();
  return (
    <Card
      titleStyles={tw`w-full flex items-center justify-between`}
      title={
        <>
          <span>Overview</span>
          <a
            href={`https://explorer.solana.com/address/${account.accountId.toString()}?cluster=${network}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline">View on Solana Explorer</Button>
          </a>
        </>
      }
      tw="pb-2"
    >
      <div tw="whitespace-nowrap overflow-x-auto">
        <TableCardBody>
          <tr>
            <td>Address</td>
            <td>
              <div tw="flex flex-col items-end">
                <AddressLink
                  tw="dark:text-primary hover:text-white"
                  address={account.accountId}
                  showCopy
                  shorten={false}
                />
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
