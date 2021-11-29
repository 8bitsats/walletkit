import type { Token } from "@saberhq/token-utils";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import tw, { styled } from "twin.macro";

import { LoadingSpinner } from "../LoadingSpinner";
import { TokenIcon } from "../TokenIcon";
import { SelectTokenModal } from "./SelectTokenModal";

interface Props {
  className?: string;
  tokens: readonly Token[];
  token: Token | null;
  isLoading?: boolean;
  onSelect?: (token: Token) => void;
}

export const TokenSelector: React.FC<Props> = ({
  className,
  tokens,
  token,
  onSelect,
  isLoading,
}: Props) => {
  const [showSelector, setShowSelector] = useState<boolean>(false);

  return (
    <>
      <AssetSelectButton
        tw="h-full"
        className={className}
        noAsset={!token}
        disabled={!onSelect}
        onClick={() => setShowSelector(!showSelector)}
      >
        {token ? (
          <div tw="flex items-center gap-3">
            <TokenIcon size={32} token={token} />
            <div>
              <div tw="font-medium">{token.name}</div>
              <div tw="leading-none text-secondary">{token.symbol}</div>
            </div>
          </div>
        ) : isLoading ? (
          <div>
            <LoadingSpinner />
          </div>
        ) : (
          <div>Select a token</div>
        )}
        {onSelect && (
          <div tw="text-base flex items-center ml-6">
            <FiChevronDown />
          </div>
        )}
      </AssetSelectButton>
      {!isLoading && onSelect && (
        <SelectTokenModal
          tokens={tokens}
          isOpen={showSelector}
          onDismiss={() => {
            setShowSelector(false);
          }}
          onSelect={(token) => {
            onSelect?.(token);
            setShowSelector(false);
          }}
        />
      )}
    </>
  );
};

const AssetSelectButton = styled.button<{ noAsset?: boolean }>(
  ({ disabled, noAsset }) => [
    tw`relative text-left flex flex-none items-center justify-between`,
    tw`appearance-none text-base`,
    tw`whitespace-nowrap py-2 px-4 rounded`,
    disabled && tw`cursor-default`,
    !disabled && tw`cursor-pointer hover:bg-gray-100 active:bg-gray-200`,
    !disabled && noAsset && tw`hover:bg-gray-100 active:bg-gray-200`,
  ]
);
