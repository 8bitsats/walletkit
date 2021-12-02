import { GiTumbleweed } from "react-icons/gi";
import { Link, useParams } from "react-router-dom";
import { css } from "twin.macro";

import type { ParsedTX } from "../../../../../hooks/useSmartWallet";
import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { Button } from "../../../../common/Button";
import { EmptyState } from "../../../../common/EmptyState";

interface TXList {
  title: string;
  filter?: (tx: ParsedTX) => boolean;
}

const LISTS = {
  all: {
    title: "All Transactions",
  },
  pending: {
    title: "Pending Transactions",
    filter: (tx: ParsedTX) =>
      tx.tx?.accountInfo.data.executedAt.isNeg() ?? false,
  },
  executed: {
    title: "Executed Transactions",
    filter: (tx: ParsedTX) =>
      !tx.tx?.accountInfo.data.executedAt.isNeg() ?? false,
  },
};

export const WalletTXListView: React.FC = () => {
  const { listId } = useParams<{ listId: keyof typeof LISTS }>();
  const list: TXList = LISTS[listId];
  const { path, parsedTXs: allParsedTXs, key, threshold } = useSmartWallet();

  const parsedTXs = list.filter
    ? allParsedTXs.filter(list.filter)
    : allParsedTXs;

  return (
    <div tw="w-full">
      <div tw="h-[57px] w-full flex items-center justify-between px-6 text-sm border-b">
        <div tw="flex items-center gap-2">
          <h1 tw="text-gray-800 font-medium">{list.title}</h1>
          <span tw="text-secondary">{parsedTXs.length}</span>
        </div>
        <Link to={`${path}/propose`}>
          <Button>Propose Transaction</Button>
        </Link>
      </div>
      {parsedTXs.length === 0 && (
        <div
          tw="flex items-center justify-center"
          css={css`
            height: calc(80vh - 57px);
          `}
        >
          <EmptyState
            icon={<GiTumbleweed />}
            title={`No ${
              listId === "all"
                ? " transactions"
                : list.title.toLocaleLowerCase()
            }.`}
          >
            <Link tw="text-primary" to={`${path}/propose`}>
              Propose a transaction
            </Link>
          </EmptyState>
        </div>
      )}
      <div>
        {parsedTXs.map(({ tx, index, instructions }, i) => {
          const numSigned = (
            (tx?.accountInfo.data.signers ?? []) as boolean[]
          ).filter((x) => !!x).length;
          return (
            <Link
              key={`tx_${index ?? `unknown_${i}`}`}
              to={`/wallets/${key.toString()}/tx/${
                tx?.accountInfo.data.index.toNumber() ?? ""
              }`}
              tw="h-[44px] flex items-center justify-between px-6 text-sm w-full hover:bg-gray-50 border-b"
            >
              <div tw="flex items-center gap-4">
                <div tw="text-gray-500">
                  TX-{tx?.accountInfo.data.index.toNumber()}
                </div>
                <div tw="text-gray-800 font-medium">
                  {instructions?.map(({ title }) => title).join(", ") ?? "--"}
                </div>
              </div>
              <div tw="flex items-center gap-4">
                <div tw="text-gray-500">
                  {numSigned} / {threshold} Sigs
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
