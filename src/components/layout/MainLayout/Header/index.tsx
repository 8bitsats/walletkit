import React from "react";
import { NavLink } from "react-router-dom";

import { ReactComponent as Icon } from "../../../common/svgs/Icon.svg";
import { ReactComponent as Logo } from "../../../common/svgs/logo-dark.svg";
import { MoreInfo } from "./MoreInfo";
import { WalletDropdown } from "./WalletDropdown";

export const Header: React.FC = () => {
  return (
    <div tw="relative flex items-center justify-between py-4">
      <div tw="z-50 flex items-center">
        <div tw="flex items-center">
          <NavLink
            to="/"
            tw="hidden md:block h-6 w-36 hover:-rotate-3 transition-all"
          >
            <Logo tw="text-primary-800 hover:text-primary h-full w-full" />
          </NavLink>
          <NavLink to="/" tw="md:hidden h-10 hover:-rotate-3 transition-all">
            <Icon tw="text-primary-800 hover:text-primary h-full w-full" />
          </NavLink>
        </div>
      </div>

      <div tw="flex justify-end items-center z-20 space-x-2">
        <WalletDropdown />
        <MoreInfo />
      </div>
    </div>
  );
};