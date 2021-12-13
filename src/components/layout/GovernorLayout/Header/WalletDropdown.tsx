import { useWalletKit } from "@gokiprotocol/walletkit";
import { useConnectedWallet, useSolana, useWallet } from "@saberhq/use-solana";
import { startCase } from "lodash";
import { useState } from "react";

import { shortenAddress } from "../../../../utils/utils";
import { Button } from "../../../common/Button";
import { Drop } from "../../../common/Drop";
import { AccountPopover } from "../../MainLayout/Header/WalletDropdown/AccountPopover";

export const WalletDropdown: React.FC = () => {
  const { connect } = useWalletKit();
  const { network } = useSolana();
  const wallet = useConnectedWallet();
  const { walletProviderInfo } = useWallet();

  const [targetRef, setTargetRef] = useState<HTMLElement | null>(null);
  const [showAccountPopover, setShowAccountPopover] = useState<boolean>(false);

  return (
    <>
      {wallet ? (
        <>
          {network !== "mainnet-beta" && (
            <span tw="text-white bg-accent text-sm px-3 py-1 rounded font-semibold">
              {startCase(network)}
            </span>
          )}
          <button
            tw="px-3 py-1 flex items-center gap-2 justify-between rounded text-white bg-warmGray-800 hover:bg-coolGray-800"
            ref={setTargetRef}
            onClick={() => {
              setShowAccountPopover((p) => !p);
            }}
          >
            <div>
              {walletProviderInfo && (
                <>
                  {typeof walletProviderInfo.icon === "string" ? (
                    <img
                      tw="h-4 w-4"
                      src={walletProviderInfo.icon}
                      alt={`Icon for wallet ${walletProviderInfo.name}`}
                    />
                  ) : (
                    <walletProviderInfo.icon tw="h-4 w-4" />
                  )}
                </>
              )}
            </div>
            <span tw="text-sm font-semibold">
              {shortenAddress(wallet.publicKey.toString())}
            </span>
          </button>
          <Drop
            onDismiss={() => setShowAccountPopover(false)}
            target={targetRef}
            show={showAccountPopover}
            placement="bottom-end"
          >
            <AccountPopover close={() => setShowAccountPopover(false)} />
          </Drop>
        </>
      ) : (
        <Button
          tw="rounded flex items-center gap-2 border-primary dark:(text-primary hover:text-white) px-3 py-2 font-bold tracking-wider"
          variant="outline"
          onClick={connect}
        >
          <span>Connect Wallet</span>
        </Button>
      )}
    </>
  );
};
