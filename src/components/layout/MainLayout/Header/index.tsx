import { useSolana } from "@saberhq/use-solana";
import { startCase } from "lodash";
import React from "react";
import { NavLink } from "react-router-dom";

import { ReactComponent as GokiIcon } from "../../../common/svgs/Icon.svg";
import { ReactComponent as GokiLogo } from "../../../common/svgs/logo-dark.svg";
import { ReactComponent as TribecaIcon } from "../../../common/svgs/tribeca/favicon.svg";
import { ReactComponent as TribecaLogo } from "../../../common/svgs/tribeca/logo.svg";
import { WalletDropdown } from "../../GovernorLayout/Header/WalletDropdown";
import { MoreInfo } from "./MoreInfo";

const Logo =
  process.env.REACT_APP_APP_CONFIG === "tribeca" ? TribecaLogo : GokiLogo;

const Icon =
  process.env.REACT_APP_APP_CONFIG === "tribeca" ? TribecaIcon : GokiIcon;

export const Header: React.FC = () => {
  const { network } = useSolana();
  return (
    <div tw="relative flex items-center justify-between py-4 md:py-12">
      <div tw="z-50 flex items-center">
        <div tw="flex items-center">
          <NavLink
            to="/"
            tw="hidden md:block h-6 w-36 hover:-rotate-3 transition-all"
          >
            <Logo tw="text-primary-800 hover:text-primary dark:(text-primary hover:text-white) h-full w-full transition-colors" />
          </NavLink>
          <NavLink to="/" tw="md:hidden h-10 hover:-rotate-3 transition-all">
            <Icon tw="text-primary-800 hover:text-primary dark:(text-primary hover:text-white) h-full w-full transition-colors" />
          </NavLink>
        </div>
      </div>

      <div tw="flex justify-end items-center z-20 gap-4">
        {network !== "mainnet-beta" && (
          <span tw="bg-accent px-3 py-0.5 text-xs rounded text-white font-medium">
            {startCase(network)}
          </span>
        )}
        <WalletDropdown />
        <MoreInfo />
      </div>
    </div>
  );
};
