import { Link, useParams } from "react-router-dom";

import { Nav } from "./Nav";
import { ReactComponent as Rook } from "./Rook.svg";
import { WalletDropdown } from "./WalletDropdown";

export const Header: React.FC = () => {
  const { governor } = useParams<{ governor: string }>();
  return (
    <div tw="bg-warmGray-900 w-screen">
      <div tw="flex items-center justify-between h-20 mx-auto w-11/12 max-w-7xl">
        <div tw="flex items-center gap-4">
          <Link to={`/gov/${governor}`}>
            <div tw="text-white hover:(text-primary -rotate-3) transition-all">
              <Rook />
            </div>
          </Link>
          <Nav />
        </div>
        <WalletDropdown />
      </div>
    </div>
  );
};
