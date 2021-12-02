import { css } from "@emotion/react";
import styled from "@emotion/styled";
import type { IFormatUint, Percent, TokenAmount } from "@saberhq/token-utils";
import React from "react";

import { formatDisplayWithSoftLimit, formatPercent } from "../../utils/format";
import { TokenIcon } from "./TokenIcon";

export interface IProps extends IFormatUint {
  amount: TokenAmount;
  isMonoNumber?: boolean;
  showIcon?: boolean;
  percent?: Percent;
  className?: string;
  showSymbol?: boolean;
  suffix?: string;
  exact?: boolean;
}

export const TokenAmountDisplay: React.FC<IProps> = ({
  amount,
  isMonoNumber = false,
  showIcon = false,
  showSymbol = true,
  percent,
  className,
  suffix = "",
  exact = false,
}: IProps) => {
  return (
    <TokenAmountWrapper className={className}>
      {showIcon && (
        <TokenIcon
          css={css`
            margin-right: 4px;
          `}
          token={amount.token}
        />
      )}
      <TheNumber isMonoNumber={isMonoNumber}>
        {exact
          ? amount.toExact()
          : formatDisplayWithSoftLimit(amount.asNumber, amount.token.decimals)}
      </TheNumber>

      {showSymbol && (
        <span>
          {"\u00A0"}
          {amount.token.symbol}
        </span>
      )}
      {percent && <PercentFmt>({formatPercent(percent)})</PercentFmt>}
      {suffix && <span>{suffix}</span>}
    </TokenAmountWrapper>
  );
};

const PercentFmt = styled.span`
  margin-left: 4px;
`;

const TokenAmountWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const TheNumber = styled.span<{ isMonoNumber?: boolean }>`
  ${({ theme, isMonoNumber }) =>
    isMonoNumber === true
      ? css`
          ${theme.mono}
        `
      : undefined}
`;
