import { useWalletKit } from "@gokiprotocol/walletkit";
import { useConnectedWallet, useWallet } from "@saberhq/use-solana";
import { useState } from "react";
import { isMobile } from "react-device-detect";
import { FaCaretDown } from "react-icons/fa";
import tw from "twin.macro";

import { shortenAddress } from "../../../../../utils/utils";
import { Button } from "../../../../common/Button";
import { Drop } from "../../../../common/Drop";
import { AccountPopover } from "./AccountPopover";
import { ReactComponent as SolanaIcon } from "./Solana.svg";

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
            css={[
              tw`font-medium bg-primary text-white flex items-center gap-2.5 py-2 hover:bg-primary-300 transition-colors`,
              tw`border px-4 rounded`,
            ]}
            ref={setTargetRef}
            onClick={() => {
              setShowAccountPopover((p) => !p);
            }}
          >
            <span>{shortenAddress(wallet.publicKey.toString(), 4)}</span>
            {walletProviderInfo && (
              <>
                {typeof walletProviderInfo.icon === "string" ? (
                  <img
                    tw="h-[26px] w-[26px]"
                    src={walletProviderInfo.icon}
                    alt={`Icon for wallet ${walletProviderInfo.name}`}
                  />
                ) : (
                  <walletProviderInfo.icon tw="h-[26px] w-[26px]" />
                )}
              </>
            )}
            <FaCaretDown />
          </button>
          <Drop
            onDismiss={() => setShowAccountPopover(false)}
            target={targetRef}
            show={showAccountPopover}
            placement={isMobile ? "bottom" : "bottom-end"}
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
          <SolanaIcon />
          <span>Connect Wallet</span>
        </Button>
      )}
    </>
  );
};
