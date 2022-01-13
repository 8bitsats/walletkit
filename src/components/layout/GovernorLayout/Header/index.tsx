import { useConnectedWallet, useSolana } from "@saberhq/use-solana";
import { startCase } from "lodash";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useWalletName } from "../../../../hooks/useWalletName";
import { Button } from "../../../common/Button";
import { LinkTwitter } from "./LinkTwitter";
import { MobileNav } from "./MobileNav";
import { Nav } from "./Nav";
import { ReactComponent as Rook } from "./Rook.svg";
import { WalletDropdown } from "./WalletDropdown";

export const Header: React.FC = () => {
  const wallet = useConnectedWallet();
  const displayName = useWalletName(wallet?.publicKey);
  const { governor } = useParams<{ governor: string }>();
  const { network } = useSolana();
  const [linkingTwitter, setLinkingTwitter] = useState<boolean>(false);
  console.log(displayName);
  return (
    <div tw="bg-warmGray-900 w-screen">
      <div tw="flex items-center justify-between h-20 mx-auto w-11/12 max-w-7xl">
        <div tw="flex items-center gap-4 z-20 md:z-auto">
          <Link to={`/gov/${governor}`}>
            <div tw="text-white hover:(text-primary -rotate-3) transition-all">
              <Rook />
            </div>
          </Link>
          <div tw="hidden md:block">
            <Nav />
          </div>
        </div>
        <div tw="flex items-center">
          {network !== "mainnet-beta" && (
            <span tw="text-white bg-accent text-sm px-3 py-1 rounded font-semibold mr-4 z-20 md:z-auto">
              {startCase(network)}
            </span>
          )}
          <WalletDropdown />
          {wallet && !displayName && (
            <Button tw="ml-4" onClick={() => setLinkingTwitter(true)}>
              Connect Twitter
            </Button>
          )}
          <MobileNav tw="ml-4 md:hidden" />
          <LinkTwitter
            isOpen={linkingTwitter}
            onDismiss={() => setLinkingTwitter(false)}
          />
        </div>
      </div>
    </div>
  );
};
