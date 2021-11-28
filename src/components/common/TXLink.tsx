import { useConnectionContext } from "@saberhq/use-solana";
import React from "react";

import { shortenAddress } from "../../utils/utils";

interface Props {
  txSig: string;
  className?: string;
  children?: React.ReactNode;
}

export const TXLink: React.FC<Props> = ({
  txSig,
  className,
  children,
}: Props) => {
  const { network } = useConnectionContext();
  return (
    <a
      className={className}
      tw="text-gray-800 hover:text-primary"
      href={`https://explorer.solana.com/tx/${txSig}?cluster=${
        network?.toString() ?? ""
      }`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children ?? shortenAddress(txSig)}
    </a>
  );
};
