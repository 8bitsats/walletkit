import { useSolana } from "@saberhq/use-solana";
import { startCase } from "lodash";
import { AiOutlineBank } from "react-icons/ai";
import { FaCode, FaInbox, FaWrench } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useSmartWallet } from "../../../../hooks/useSmartWallet";
import { AddressLink } from "../../../common/AddressLink";
import { ReactComponent as GokiLogo } from "../../../common/svgs/logo-dark.svg";
import { WalletDropdownMini } from "../WalletDropdownMini";
import { SidebarNavLink } from "./SidebarNavLink";

const MAIN_LINKS = [
  {
    icon: <FaInbox />,
    title: "Inbox",
    href: "/inbox",
  },
  {
    icon: <AiOutlineBank />,
    title: "Treasury",
    href: "/treasury",
  },
  {
    icon: <FaCode />,
    title: "Programs",
    href: "/programs",
  },
  {
    icon: <FaWrench />,
    title: "Settings",
    href: "/settings",
  },
];

const NAV_LINKS = [
  {
    title: "All",
    href: "/txs/all",
  },
  {
    title: "Pending",
    href: "/txs/pending",
  },
  {
    title: "Executed",
    href: "/txs/executed",
  },
];

export const Sidebar: React.FC = () => {
  const { key, path } = useSmartWallet();
  const { network } = useSolana();
  return (
    <nav tw="w-[220px] max-w-[330px] h-screen border-r flex flex-col justify-between flex-grow-0 flex-shrink-0">
      <div>
        <div tw="px-5 py-3 grid gap-7">
          <div tw="flex items-center justify-between">
            <Link to={path}>
              <GokiLogo tw="h-5 w-min text-primary-800 hover:(text-primary -rotate-3) transition-all" />
            </Link>
            {network !== "mainnet-beta" && (
              <span tw="bg-accent-500 text-white px-3 py-0.5 rounded text-xs">
                {startCase(network)}
              </span>
            )}
          </div>
          <div tw="border rounded px-3 py-2 text-sm flex items-center gap-1">
            <span>Wallet:</span>
            <AddressLink
              tw="font-semibold"
              address={key}
              showCopy
              showRaw={false}
            />
          </div>
        </div>
        <div tw="flex flex-col px-4 mb-0.5 gap-7">
          <div tw="flex flex-col">
            {MAIN_LINKS.map(({ title, href, icon }) => {
              return (
                <SidebarNavLink
                  key={href}
                  to={`/wallets/${key.toString()}${href}`}
                  tw="px-2"
                >
                  <div tw="flex items-center gap-2">
                    {icon}
                    {title}
                  </div>
                </SidebarNavLink>
              );
            })}
          </div>
          <div tw="flex flex-col">
            <h3 tw="text-xs font-medium text-gray-500 mb-1 px-2">
              Transactions
            </h3>
            {NAV_LINKS.map(({ title, href }) => {
              return (
                <SidebarNavLink
                  key={href}
                  to={`/wallets/${key.toString()}${href}`}
                >
                  {title}
                </SidebarNavLink>
              );
            })}
          </div>
        </div>
      </div>
      <div tw="px-5 py-3 mb-3">
        <WalletDropdownMini />
      </div>
    </nav>
  );
};
