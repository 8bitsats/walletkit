import { css, keyframes } from "@emotion/react";

import { ReactComponent as AnchorLogo } from "./AnchorLogo.svg";

const FADE_IN_DOWN = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Jumbotron: React.FC = () => {
  return (
    <header tw="text-center w-full mx-auto flex flex-col items-center gap-6 pt-16">
      <div tw="max-w-4xl flex flex-col items-center gap-6">
        <div tw="flex flex-col items-center gap-2">
          <AnchorLogo
            tw="w-36 h-36 mb-8"
            css={css`
              animation: 1.5s ${FADE_IN_DOWN} 0.01s normal forwards ease-out;
            `}
          />
          <h1 tw="text-3xl font-black leading-snug text-white relative md:(text-7xl leading-snug)">
            <div
              css={css`
                animation: 1.5s ${FADE_IN_DOWN} 0.01s normal forwards ease-out;
              `}
            >
              Tools for Anchor.
            </div>
            <div
              tw="md:text-6xl"
              css={css`
                opacity: 0;
                animation: 1.5s ${FADE_IN_DOWN} 0.2s normal forwards ease-out;
              `}
            >
              By devs, for devs.
            </div>
          </h1>
        </div>
        <p
          tw="text-slate-400 text-base leading-relaxed max-w-3xl md:(text-2xl leading-relaxed)"
          css={css`
            opacity: 0;
            animation: 1.5s ${FADE_IN_DOWN} 0.4s normal forwards ease-out;
          `}
        >
          Anchor.so hosts a suite of developer tools to help Solana developers
          ship better, safer apps.
        </p>
        <p
          tw="mt-24"
          css={css`
            opacity: 0;
            animation: 1.5s ${FADE_IN_DOWN} 0.6s normal forwards ease-out;
          `}
        >
          a collaboration by{" "}
          <a
            tw="text-teal-400 hover:text-accent-300 transition-colors"
            href="https://ship.capital"
            target="_blank"
            rel="noreferrer"
          >
            Ship Capital 🚢
          </a>
        </p>
      </div>
    </header>
  );
};
