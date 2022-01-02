import type { PublicKey } from "@solana/web3.js";

import { useProgramLabel } from "../../../hooks/useProgramMeta";
import { AddressLink } from "../AddressLink";

interface Props {
  address: PublicKey;
}

export const ProgramLabel: React.FC<Props> = ({ address }: Props) => {
  const label = useProgramLabel(address);
  return (
    <AddressLink tw="dark:text-primary hover:text-opacity-80" address={address}>
      {label}
    </AddressLink>
  );
};
