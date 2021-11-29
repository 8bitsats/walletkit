import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { DEFAULT_TOKEN_DECIMALS } from "@saberhq/stableswap-sdk";
import type { Token } from "@saberhq/token-utils";
import { TokenAmount } from "@saberhq/token-utils";
import React from "react";
import tw from "twin.macro";

import { BREAKPOINT_SIZES } from "../../../theme/breakpoints";
import useWindowDimensions from "../../../utils/useWindowDimensions";
import { TokenAmountDisplay } from "../TokenAmountDisplay";
import { TokenSelector } from "../TokenSelector";
import { InputDecimal } from "./InputDecimal";

interface IProps {
  label: string;
  tokens: readonly Token[];
  onTokenSelect?: (token: Token) => void;
  token: Token | null;
  inputValue: string;
  inputOnChange?: (val: string) => void;
  inputDisabled?: boolean;
  isLoading?: boolean;
  className?: string;

  currentAmount?: {
    amount?: TokenAmount;
    allowSelect?: boolean;
    label?: string;
  };
}

/**
 * Selects a token and its amount
 * @param param0
 * @returns
 */
export const InputTokenAmount: React.FC<IProps> = ({
  label,
  tokens,
  onTokenSelect,
  token,
  inputValue,
  inputOnChange,
  inputDisabled = false,
  currentAmount,
  className,
  isLoading,
}: IProps) => {
  const { width } = useWindowDimensions();
  const uiDecimals =
    width < BREAKPOINT_SIZES[0] ? 4 : token?.decimals ?? DEFAULT_TOKEN_DECIMALS;

  return (
    <div tw="flex flex-col gap-2" className={className}>
      <div tw="flex items-center justify-between">
        <div tw="text-sm font-medium">{label}</div>
        {token && (
          <div>
            {currentAmount ? (
              <Balance>
                <span>{currentAmount.label ?? "Balance"}:</span>
                {currentAmount.amount ? (
                  <Accent
                    onClick={
                      currentAmount.allowSelect
                        ? () => {
                            inputOnChange?.(
                              currentAmount.amount?.toExact() ?? "0"
                            );
                          }
                        : undefined
                    }
                  >
                    <TokenAmountDisplay
                      amount={currentAmount.amount ?? new TokenAmount(token, 0)}
                      locale="en-US"
                      numberFormatOptions={{
                        minimumFractionDigits: uiDecimals,
                        maximumFractionDigits: uiDecimals,
                      }}
                    />
                  </Accent>
                ) : (
                  <NoAmount>--</NoAmount>
                )}
              </Balance>
            ) : (
              <div />
            )}
          </div>
        )}
      </div>
      <div tw="flex gap-4">
        <TokenSelector
          tw="bg-white shadow-xl rounded-xl flex-basis[200px]"
          tokens={tokens}
          isLoading={isLoading}
          token={token}
          onSelect={onTokenSelect}
        />
        <InputDecimal
          tw="text-right w-1/2 bg-transparent border-none"
          placeholder="0.00"
          disabled={inputDisabled}
          value={inputValue}
          onChange={inputOnChange}
        />
      </div>
    </div>
  );
};

const NoAmount = styled.span`
  margin-left: 0.5em;
  color: ${({ theme }) => theme.colors.text.default};
`;

const Accent = styled.span<{ onClick?: () => void }>`
  margin-left: 0.5em;
  ${tw`text-primary`}
  ${({ onClick }) =>
    onClick !== undefined &&
    css`
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    `}
`;

const Balance = styled.div`
  font-weight: normal;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text.default};

  display: flex;
  align-items: center;
`;
