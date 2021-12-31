import styled from "@emotion/styled";
import { DEFAULT_NETWORK_CONFIG_MAP } from "@saberhq/solana-contrib";
import { useSolana } from "@saberhq/use-solana";
import copyToClipboard from "copy-to-clipboard";
import React, { useMemo } from "react";
import { FaCopy, FaExternalLinkAlt, FaGlobe, FaPowerOff } from "react-icons/fa";
import tw from "twin.macro";

import { SOLE_NETWORK } from "../../../../../contexts/wallet";
import { notify } from "../../../../../utils/notifications";
import { Button } from "../../../../common/Button";
import { MouseoverTooltip } from "../../../../common/MouseoverTooltip";

interface Props {
  close?: () => void;
}

export const AccountPopover: React.FC<Props> = ({ close }: Props) => {
  const { publicKey, walletProviderInfo, network, disconnect, setNetwork } =
    useSolana();
  const { address, icon } = useMemo(() => {
    if (!walletProviderInfo || !publicKey) {
      return {
        address: null,
        icon: null,
      };
    }
    const address = publicKey.toString();
    const trunc = `${address.slice(0, 4)}…${address.slice(address.length - 4)}`;

    const icon =
      typeof walletProviderInfo.icon === "string" ? (
        <img
          src={walletProviderInfo.icon}
          alt={`Logo for wallet ${walletProviderInfo.name}`}
        />
      ) : (
        <walletProviderInfo.icon />
      );

    return {
      address: trunc,
      icon,
    };
  }, [publicKey, walletProviderInfo]);

  if (!publicKey) {
    return null;
  }

  return (
    <div tw="w-screen max-w-[378px]">
      <div tw="w-11/12 md:w-full bg-white rounded-lg border dark:(bg-warmGray-850 border-warmGray-800)">
        <div tw="flex items-center justify-between p-7 border-b dark:border-warmGray-800">
          <div tw="grid gap-2 text-base">
            <div tw="flex gap-1 items-center">
              <WalletIconWrapper tw="h-6 w-6">{icon}</WalletIconWrapper>
              <span tw="font-medium">{address}</span>
            </div>
            <span tw="text-secondary">
              {DEFAULT_NETWORK_CONFIG_MAP[network].name}
            </span>
          </div>
          <div tw="flex gap-3">
            <MouseoverTooltip text="Copy Address">
              <Button
                variant="muted"
                icon
                onClick={() => {
                  copyToClipboard(publicKey.toString());
                  close?.();
                  notify({ message: "Address copied to clipboard." });
                }}
              >
                <FaCopy />
              </Button>
            </MouseoverTooltip>
            <MouseoverTooltip text="View on Explorer">
              <a
                href={`https://explorer.solana.com/address/${publicKey.toString()}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="muted" icon>
                  <FaExternalLinkAlt />
                </Button>
              </a>
            </MouseoverTooltip>
          </div>
        </div>
        <div tw="p-5 flex flex-col gap-1">
          {network === "mainnet-beta" && (
            <MenuItem
              onClick={() => {
                if (SOLE_NETWORK) {
                  window.location.href = `https://devnet.${window.location.hostname}`;
                } else {
                  setNetwork("devnet");
                }
                close?.();
              }}
            >
              <FaGlobe />
              <span>Switch to Devnet</span>
            </MenuItem>
          )}
          {network === "devnet" && (
            <MenuItem
              onClick={() => {
                if (SOLE_NETWORK) {
                  if (window.location.hostname === "devnet.goki.so") {
                    window.location.href = "https://goki.so";
                  } else if (window.location.hostname === "devnet.tribeca.so") {
                    window.location.href = "https://tribeca.so";
                  }
                } else {
                  setNetwork("mainnet-beta");
                }
                close?.();
              }}
            >
              <FaGlobe />
              <span>Switch to Mainnet</span>
            </MenuItem>
          )}
          <MenuItem onClick={disconnect}>
            <FaPowerOff />
            <span>Disconnect</span>
          </MenuItem>
        </div>
      </div>
    </div>
  );
};

const WalletIconWrapper = styled.div`
  & > img,
  & > svg {
    height: 100%;
    width: 100%;
  }
`;

const MenuItem = styled.button(() => [
  tw`h-10 appearance-none w-full rounded border-none outline-none bg-none`,
  tw`hover:(bg-gray-200 dark:(bg-opacity-20 text-white))`,
  tw`flex items-center gap-3 text-base p-3 cursor-pointer leading-4`,
]);
