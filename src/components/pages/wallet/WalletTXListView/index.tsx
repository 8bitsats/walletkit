import { startCase } from "lodash";
import { Link } from "react-router-dom";

import { useSmartWallet } from "../../../../hooks/useSmartWallet";

export const WalletTXListView: React.FC = () => {
  const { smartWallet, parsedTXs, key } = useSmartWallet();

  const threshold = smartWallet?.data?.threshold.toNumber();
  return (
    <div tw="w-full">
      {parsedTXs.map(({ tx, instructions }, i) => {
        const numSigned = (
          (tx?.accountInfo.data.signers ?? []) as boolean[]
        ).filter((x) => !!x).length;
        return (
          <Link
            key={`tx_${i}`}
            to={`/wallets/${key.toString()}/tx/${
              tx?.accountInfo.data.index.toNumber() ?? ""
            }`}
            tw="h-7 flex items-center justify-between px-6 text-sm w-full hover:bg-gray-50"
          >
            <div tw="flex items-center gap-4">
              <div tw="text-gray-500">
                TX-{tx?.accountInfo.data.index.toNumber()}
              </div>
              <div tw="text-gray-800 font-medium">
                {instructions
                  ?.map(({ parsed }) =>
                    startCase(parsed?.name ?? "Unknown Instruction")
                  )
                  .join(", ") ?? "--"}
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
  );
};
