import { startCase } from "lodash";

import { useSmartWallet } from "../../../../hooks/useSmartWallet";

export const WalletTXListView: React.FC = () => {
  const { smartWallet, parsedTXs } = useSmartWallet();

  const threshold = smartWallet?.data?.threshold.toNumber();
  return (
    <div tw="w-full">
      {parsedTXs.map(({ tx, parsed }, i) => {
        const numSigned = (
          (tx?.accountInfo.data.signers ?? []) as boolean[]
        ).filter((x) => !!x).length;
        return (
          <div
            key={`tx_${i}`}
            tw="h-7 flex items-center justify-between px-6 text-sm w-full"
          >
            <div tw="flex items-center gap-4">
              <div tw="text-gray-500">
                TX-{tx?.accountInfo.data.index.toNumber()}
              </div>
              <div tw="text-gray-800 font-medium">
                {startCase(parsed?.name ?? "Unknown Instruction")}
              </div>
            </div>
            <div tw="flex items-center gap-4">
              <div tw="text-gray-500">
                {numSigned} / {threshold} Sigs
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
