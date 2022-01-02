import { useConnectionContext } from "@saberhq/use-solana";
import React from "react";
import tw from "twin.macro";

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
  const isTribeca = process.env.REACT_APP_APP_CONFIG === "tribeca";
  return (
    <a
      className={className}
      css={[
        isTribeca && tw`text-white`,
        !isTribeca && tw`text-gray-800`,
        tw`hover:text-primary`,
      ]}
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
