import { FaArrowRight } from "react-icons/fa";

import { Button } from "../../../common/Button";

export const Jumbotron: React.FC = () => {
  return (
    <header tw="text-center w-full mx-auto flex flex-col items-center gap-6 pt-16">
      <div tw="max-w-4xl flex flex-col items-center gap-6">
        <div tw="flex flex-col items-center gap-2">
          <h1 tw="text-3xl font-black leading-snug text-white md:(text-7xl leading-snug)">
            Governance.
            <br />
            By DAOs, for DAOs.
          </h1>
        </div>
        <p tw="text-slate-400 text-base leading-relaxed max-w-3xl md:(text-2xl leading-relaxed)">
          Tribeca is a protocol for creating, managing, and interacting with
          decentralized autonomous organizations on Solana.
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
    </header>
  );
};
