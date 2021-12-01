import { useWalletKit } from "@gokiprotocol/walletkit";
import { useConnectedWallet, useSolana, useWallet } from "@saberhq/use-solana";
import { startCase } from "lodash";
import { useState } from "react";
import { isMobile } from "react-device-detect";

import { shortenAddress } from "../../../utils/utils";
import { Button } from "../../common/Button";
import { Drop } from "../../common/Drop";
import { AccountPopover } from "../MainLayout/Header/WalletDropdown/AccountPopover";
import { ReactComponent as SolanaIcon } from "./SolanaIcon.svg";

export const WalletDropdownMini: React.FC = () => {
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
          <button
            tw="px-5 py-3 w-full flex items-center justify-between border rounded hover:bg-gray-50"
            ref={setTargetRef}
            onClick={() => {
              setShowAccountPopover((p) => !p);
            }}
          >
            <div tw="text-left grid gap-0.5 text-sm">
              <span tw="font-semibold">
                {shortenAddress(wallet.publicKey.toString())}
              </span>
              <span tw="text-secondary">{startCase(network)}</span>
            </div>
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
          </button>
          <Drop
            onDismiss={() => setShowAccountPopover(false)}
            target={targetRef}
            show={showAccountPopover}
            placement={isMobile ? "top" : "top-start"}
          >
            <AccountPopover close={() => setShowAccountPopover(false)} />
          </Drop>
        </>
      ) : (
        <Button
          tw="h-7 flex items-center gap-2"
          variant="primary"
          onClick={connect}
        >
          <span>Connect a Wallet</span>
          <SolanaIcon />
        </Button>
      )}
    </>
  );
};
