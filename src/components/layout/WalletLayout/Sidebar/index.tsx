import { NavLink } from "react-router-dom";
import tw, { css } from "twin.macro";

import { useSmartWallet } from "../../../../hooks/useSmartWallet";
import { ReactComponent as GokiLogo } from "../../../common/svgs/logo-dark.svg";
import { WalletDropdownMini } from "../WalletDropdownMini";

const NAV_LINKS = [
  {
    title: "All",
    href: "/tx/all",
  },
  {
    title: "Pending",
    href: "/tx/pending",
  },
  {
    title: "Executed",
    href: "/tx/executed",
  },
];

export const Sidebar: React.FC = () => {
  const { key } = useSmartWallet();
  return (
    <nav tw="w-[220px] max-w-[330px] h-screen border-r flex flex-col">
      <div tw="px-5 py-3 grid gap-7">
        <GokiLogo tw="h-5 w-min text-primary-800 hover:(text-primary -rotate-3) transition-all" />
        <WalletDropdownMini />
      </div>
      <div tw="flex flex-col px-4 mb-0.5">
        <h3 tw="text-xs font-medium text-gray-500 mb-1">Transactions</h3>
        {NAV_LINKS.map(({ title, href }) => {
          return (
            <NavLink
              key={href}
              to={`/wallets/${key.toString()}${href}`}
              tw="text-gray-700 text-sm font-medium h-7 flex items-center px-2.5 rounded cursor-pointer hover:(bg-gray-100)"
              activeClassName="is-active"
              css={css`
                &.is-active {
                  ${tw`bg-gray-100`}
                }
              `}
            >
              {title}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
