import type { PublicKey } from "@solana/web3.js";
import { GiTumbleweed } from "react-icons/gi";

import { AddressLink } from "../AddressLink";
import { EmptyState } from "../EmptyState";

interface Props {
  smartWallet: PublicKey;
}

export const NoPrograms: React.FC<Props> = ({ smartWallet }: Props) => {
  return (
    <>
      <EmptyState
        icon={<GiTumbleweed />}
        title="This DAO doesn't own any programs."
      >
        <div tw="text-center">
          <p>
            The DAO at address <AddressLink address={smartWallet} showCopy />{" "}
            does not own any programs.
          </p>
          <p>
            <a
              tw="text-primary"
              href="https://docs.solana.com/cli/deploy-a-program#set-a-programs-upgrade-authority"
              target="_blank"
              rel="noreferrer"
            >
              Read the Solana Wiki to learn more about upgrade authorities.
            </a>
          </p>
        </div>
      </EmptyState>
    </>
  );
};
