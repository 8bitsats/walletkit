import { useSolana } from "@saberhq/use-solana";
import { startCase } from "lodash";
import { Link, useParams } from "react-router-dom";

import { MobileNav } from "./MobileNav";
import { Nav } from "./Nav";
import { ReactComponent as Rook } from "./Rook.svg";
import { WalletDropdown } from "./WalletDropdown";

export const Header: React.FC = () => {
  const { governor } = useParams<{ governor: string }>();
  const { network } = useSolana();
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
          <MobileNav tw="ml-4 md:hidden" />
        </div>
      </div>
    </div>
  );
};
