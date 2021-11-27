import { FaArrowRight } from "react-icons/fa";

import { Button } from "../../common/Button";

export const Jumbotron: React.FC = () => {
  return (
    <header tw="text-center max-w-2xl w-full mx-auto flex flex-col items-center gap-6">
      <h2 tw="text-primary uppercase font-semibold tracking-widest">
        For DAOs, teams, and secure individuals
      </h2>
      <h1 tw="text-5xl font-black mb-2">Secure your admin keys.</h1>
      <p tw="text-secondary font-semibold text-2xl">
        Goki allows you to create, manage, and audit multisig wallets with
        transparency.
      </p>
      <Button
        variant="primary"
        tw="flex items-center gap-4 h-12 w-[200px] mt-6"
      >
        <span>Get Started</span>
        <FaArrowRight />
      </Button>
    </header>
  );
};
