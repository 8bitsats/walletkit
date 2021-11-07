import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import tw, { styled } from "twin.macro";

export const Nav: React.FC = () => {
  return (
    <div tw="fixed -translate-y-1/2 bottom-0 flex w-full items-center justify-center z-10 md:(absolute z-0 translate-y-0 h-full top-0)">
      <div tw="flex justify-center gap-5 bg-white border rounded-2xl p-1 md:(w-auto border-none bg-transparent)">
        <NavLink to="/issue">issue</NavLink>
        <NavLink to="/arrows">stake</NavLink>
      </div>
    </div>
  );
};

const makeStyledLink = styled(Link);

const StyledNavLink = makeStyledLink(({ active }: { active?: boolean }) => [
  tw`font-sans uppercase relative text-DEFAULT text-xl px-3 rounded-xl`,
  tw`hover:text-brand`,
  active && tw`text-brand-800 pb-0 md:bg-transparent`,
  tw`border-transparent`,
]);

const NavLink: React.FC<{
  children: React.ReactNode;
  to: string;
}> = ({ children, to }) => {
  const active = !!useRouteMatch(to);
  return (
    <StyledNavLink active={active} to={to}>
      <span>{children}</span>
    </StyledNavLink>
  );
};
