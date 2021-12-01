import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { css, theme } from "twin.macro";

import { Button } from "../../common/Button";

export const Jumbotron: React.FC = () => {
  return (
    <header tw="text-center w-full mx-auto flex flex-col items-center gap-6">
      <div tw="max-w-2xl flex flex-col gap-6">
        <h2 tw="text-primary uppercase font-semibold tracking-widest">
          For DAOs, teams, and secure individuals
        </h2>
        <h1 tw="text-5xl font-black mb-2">Secure your admin keys.</h1>
        <p tw="text-secondary font-semibold text-2xl">
          Goki allows you to create, manage, and view
          <br />
          multisig wallets with transparency.
        </p>
      </div>
      <Link to="/onboarding/new">
        <Button
          variant="primary"
          tw="flex items-center gap-4 h-12 w-[200px] mt-6 text-base"
        >
          <span>Get Started</span>
          <FaArrowRight />
        </Button>
      </Link>
      <div tw="relative w-full mt-20">
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
