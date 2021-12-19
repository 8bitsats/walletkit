import { FaArrowRight } from "react-icons/fa";
import { css, theme } from "twin.macro";
import Typewriter from "typewriter-effect";

import { Button } from "../../../common/Button";

export const Jumbotron: React.FC = () => {
  return (
    <header tw="text-center w-full mx-auto flex flex-col items-center gap-6">
      <div tw="max-w-2xl flex flex-col items-center gap-6">
        <h2 tw="text-primary uppercase font-semibold letter-spacing[0.2em]">
          Built for DAOs, by DAOS
        </h2>
        <h1 tw="text-5xl font-black leading-tight text-white">
          Vote on your own terms.
        </h1>
        <span tw="text-2xl font-black inline-flex text-white">
          <span>The easiest way to&nbsp;</span>
          <span tw="text-secondary">
            <Typewriter
              options={{
                strings: [
                  "decentralize.",
                  "run a DAO.",
                  "launch a token.",
                  "manage a DAO's treasury.",
                  "vote.",
                  "manage protocol-owned liquidity.",
                  "upgrade programs.",
                ],
                autoStart: true,
                loop: true,
              }}
            />
          </span>
        </span>
        <p tw="text-gray-400 font-semibold text-2xl leading-relaxed">
          Tribeca lets you create, manage, and interact with decentralized
          autonomous organizations on Solana.
        </p>
      </div>
      <a
        target="_blank"
        href="https://forms.gle/mLPHEjqMxL4eoCo56"
        rel="noreferrer"
      >
        <Button
          variant="primary"
          tw="flex font-semibold items-center gap-4 h-12 w-[200px] mt-6 text-base"
        >
          <span>Join the Waitlist</span>
          <FaArrowRight />
        </Button>
      </a>
      <div tw="relative w-full mt-12">
        <div
          tw="absolute -left-24 top-0 -right-24 -mt-10 bottom-0 w-full"
          css={css`
            width: calc(100vw + 24 * 4 * 2px);
            z-index: -100;
            background: conic-gradient(
              from 270deg at 50% 50%,
              ${theme`colors.primary`} 0deg,
              ${theme`colors.primary.300`} 60deg,
              ${theme`colors.accent.300`} 120deg,
              ${theme`colors.accent`} 180deg,
              ${theme`colors.accent.700`} 240deg,
              ${theme`colors.primary.700`} 300deg,
              ${theme`colors.primary`} 360deg
            );
            filter: blur(50px);
          `}
        />
        <div tw="w-full z-10 pt-10">
          <div tw="p-3 pb-0 rounded-t-2xl bg-gray-500 w-5/6 max-w-4xl mx-auto">
            <img
              tw="rounded-t-xl"
              src="/images/app-preview.webp"
              alt="Goki Screenshot"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
