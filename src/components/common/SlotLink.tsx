import { useConnectionContext } from "@saberhq/use-solana";
import React from "react";

interface Props {
  slot: number;
  className?: string;
  children?: React.ReactNode;
}

export const SlotLink: React.FC<Props> = ({
  slot,
  className,
  children,
}: Props) => {
  const { network } = useConnectionContext();
  return (
    <a
      className={className}
      tw="text-gray-800 hover:text-primary"
      href={`https://explorer.solana.com/block/${slot}?cluster=${
        network?.toString() ?? ""
      }`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children ?? slot.toLocaleString()}
    </a>
  );
};
