import { useWalletKit } from "@gokiprotocol/walletkit";
import { useConnectedWallet, useWallet } from "@saberhq/use-solana";
import { useState } from "react";

import { shortenAddress } from "../../../../utils/utils";
import { Button } from "../../../common/Button";
import { Drop } from "../../../common/Drop";
import { AccountPopover } from "../../MainLayout/Header/WalletDropdown/AccountPopover";

export const WalletDropdown: React.FC = () => {
  const { connect } = useWalletKit();
  const wallet = useConnectedWallet();
  const { walletProviderInfo } = useWallet();

  const [targetRef, setTargetRef] = useState<HTMLElement | null>(null);
  const [showAccountPopover, setShowAccountPopover] = useState<boolean>(false);

  return (
    <>
      {wallet ? (
        <>
          <button
            tw="px-3 py-1 flex items-center gap-2 justify-between rounded text-white bg-warmGray-800 hover:bg-coolGray-800 z-20 md:z-auto"
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
          tw="rounded flex items-center gap-2 border-primary dark:(text-primary hover:text-white) px-3 py-2 font-bold tracking-wider z-20 md:z-auto"
          variant="outline"
          onClick={connect}
        >
          <span>Connect Wallet</span>
        </Button>
      )}
    </>
  );
};
