import { useMemo } from "react";
import { NavLink, useParams } from "react-router-dom";
import tw, { css } from "twin.macro";

import { useGaugemeister } from "../../../pages/governance/gauges/hooks/useGaugemeister";

export const NAV_LINKS = [
  {
    title: "Overview",
    href: "/",
    exact: true,
  },
  {
    title: "Proposals",
    href: "/proposals",
  },
  {
    title: "Locker",
    href: "/locker",
  },
  {
    title: "Parameters",
    href: "/details",
  },
  // {
  //   title: "Boost",
  //   href: "/boost",
  // },
  // {
  //   title: "Payouts",
  //   href: "/payouts",
  // },
];

interface Props {
  className?: string;
}

export const Nav: React.FC<Props> = ({ className }: Props) => {
  const { governor } = useParams<{ governor: string }>();
  const gm = useGaugemeister();
  const navLinks = useMemo(
    () => [
      ...NAV_LINKS,
      ...(gm
        ? [
            {
              title: "Gauges",
              href: "/gauges",
            },
          ]
        : []),
    ],
    [gm]
  );
  return (
    <nav tw="flex gap-2" className={className}>
      {navLinks.map(({ title, href, exact }) => (
        <NavLink
          exact={exact}
          activeClassName="active"
          key={href}
          to={`/gov/${governor}${href}`}
          css={[
            tw`px-3 py-1 rounded text-sm font-semibold transition-colors`,
            css`
              &.active {
                ${tw`text-white bg-warmGray-800`}
              }
            `,
            tw`hover:text-white`,
          ]}
        >
          <div>{title}</div>
        </NavLink>
      ))}
    </nav>
  );
};
