import { useState } from "react";
import { FaGripLines } from "react-icons/fa";
import { NavLink, useParams } from "react-router-dom";
import tw, { css } from "twin.macro";

import { NAV_LINKS } from "./Nav";

interface Props {
  className?: string;
}

export const MobileNav: React.FC<Props> = ({ className }: Props) => {
  const { governor } = useParams<{ governor: string }>();
  const [showNav, setShowNav] = useState<boolean>(false);
  return (
    <div className={className}>
      <div
        css={[
          tw`fixed left-0 bottom-0 h-screen w-screen bg-warmGray-900 transition-all transition-duration[500ms] z-10`,
          css`
            height: calc(100vh - 80px);
          `,
          !showNav && tw`opacity-0 pointer-events-none`,
          !showNav &&
            css`
              transform: translate3d(0, -100%, 0);
              transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
                opacity 0.3s ease-in;
            `,
          showNav && tw`translate-y-0 opacity-100`,
          tw`flex flex-col`,
        ]}
      >
        <div tw="flex flex-grow items-center justify-center">
          <div tw="flex flex-col items-center font-bold text-base text-white">
            {NAV_LINKS.map(({ title, href, exact }) => (
              <NavLink
                exact={exact}
                activeClassName="active"
                key={href}
                to={`/gov/${governor}${href}`}
                tw="py-5"
                onClick={() => {
                  setShowNav(false);
                }}
              >
                <div>{title}</div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      <button
        tw="z-20 relative"
        onClick={() => {
          setShowNav((res) => !res);
        }}
      >
        <FaGripLines />
      </button>
    </div>
  );
};
