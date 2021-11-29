import { useUserAssociatedTokenAccounts } from "@quarryprotocol/react-quarry";
import type { Token } from "@saberhq/token-utils";
import { useConnectedWallet } from "@saberhq/use-solana";

import { LoadingSpinner } from "../../LoadingSpinner";
import type { ModalProps } from "../../Modal";
import { Modal } from "../../Modal";
import { TokenIcon } from "../../TokenIcon";
import { ReactComponent as SolanaLogo } from "./solana.svg";
import { ReactComponent as Solscan } from "./solscan.svg";
import { ReactComponent as SolscanGray } from "./solscan-gray.svg";

interface Props extends Omit<ModalProps, "children"> {
  tokens: readonly Token[];
  onSelect: (token: Token) => void;
}

export const SelectTokenModal: React.FC<Props> = ({
  onSelect,
  tokens,
  ...modalProps
}: Props) => {
  const wallet = useConnectedWallet();
  const balances = useUserAssociatedTokenAccounts(tokens);
  return (
    <Modal {...modalProps} tw="p-0">
      <div tw="grid gap-3 py-3">
        <div tw="h-6 flex items-center justify-center">
          <SolanaLogo />
        </div>
        <div tw="mt-10 px-7">
          <h2 tw="font-bold text-xl">Select a token</h2>
        </div>
        <div>
          {tokens.map((token) => {
            const userBalance = balances.find((b) =>
              b?.balance.token.equals(token)
            );
            return (
              // TODO: make this accessible
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <div
                role="button"
                tabIndex={0}
                key={token.address}
                tw="cursor-pointer hover:bg-gray-100 h-16 flex items-center px-7"
                onClick={() => {
                  onSelect(token);
                }}
              >
                <div tw="flex items-center h-full w-full justify-between border-b">
                  <div tw="flex gap-3 items-center w-full h-full">
                    <TokenIcon size={20} token={token} />
                    <div tw="flex flex-col flex-shrink-[1]">
                      <span tw="text-sm font-medium">{token.name}</span>
                      {wallet && (
                        <span tw="text-xs text-secondary">
                          {userBalance?.loading || userBalance === undefined ? (
                            <LoadingSpinner />
                          ) : (
                            userBalance?.balance.formatUnits() ??
                            `0 ${token.symbol}`
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <a
                    className="group"
                    href={`https://solscan.io/address/${token.address}`}
                    target="_blank"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    rel="noreferrer"
                  >
                    <Solscan tw="hidden group-hover:block" />
                    <SolscanGray tw="group-hover:hidden" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
