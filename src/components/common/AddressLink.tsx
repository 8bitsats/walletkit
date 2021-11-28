import styled from "@emotion/styled";
import { useConnectionContext } from "@saberhq/use-solana";
import type { PublicKey } from "@solana/web3.js";
import copy from "copy-to-clipboard";
import React from "react";
import { FaRegCopy } from "react-icons/fa";

import { notify } from "../../utils/notifications";
import { shortenAddress } from "../../utils/utils";

interface Props {
  address: PublicKey;
  className?: string;
  showCopy?: boolean;
  children?: React.ReactNode;
}

export const AddressLink: React.FC<Props> = ({
  address,
  className,
  showCopy = false,
  children,
}: Props) => {
  const { network } = useConnectionContext();
  return (
    <Wrapper className={className}>
      <a
        href={`https://explorer.solana.com/address/${address.toString()}?cluster=${
          network?.toString() ?? ""
        }`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children ?? shortenAddress(address.toString())}
      </a>
      {showCopy && (
        <CopyIcon
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            copy(address.toString());
            notify({ message: "Copied address to clipboard." });
          }}
        />
      )}
    </Wrapper>
  );
};
const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
`;

const CopyIcon = styled(FaRegCopy)`
  margin-left: 4px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.default};
  &:hover {
    color: ${({ theme }) => theme.colors.text.bold};
  }
`;
