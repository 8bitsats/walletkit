import { useWalletKit } from "@gokiprotocol/walletkit";
import { useConnectedWallet, useWallet } from "@saberhq/use-solana";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import tw from "twin.macro";

import { shortenAddress } from "../../../utils/utils";
import { Button } from "../../common/Button";
import { Drop } from "../../common/Drop";
import { AccountPopover } from "../MainLayout/Header/WalletDropdown/AccountPopover";

export const WalletDropdownMini: React.FC = () => {
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
            css={[
              tw`font-medium flex items-center justify-between py-2 hover:bg-gray-50 transition-colors`,
              tw`border border-gray-200 shadow-sm px-4 rounded h-7 text-xs`,
            ]}
            ref={setTargetRef}
            onClick={() => {
              setShowAccountPopover((p) => !p);
            }}
          >
            <span>{shortenAddress(wallet.publicKey.toString())}</span>
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
          </button>
          <Drop
            onDismiss={() => setShowAccountPopover(false)}
            target={targetRef}
            show={showAccountPopover}
            placement={isMobile ? "bottom" : "bottom-start"}
          >
            <AccountPopover close={() => setShowAccountPopover(false)} />
          </Drop>
        </>
      ) : (
        <Button
          variant="primary"
          tw="font-sans font-light flex flex-row gap-4 px-4"
          onClick={connect}
        >
          <span>Connect Wallet</span>
        </Button>
      )}
    </>
  );
};
