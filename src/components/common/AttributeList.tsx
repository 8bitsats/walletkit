import styled from "@emotion/styled";
import { Percent, Price, Token, TokenAmount } from "@saberhq/token-utils";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import React from "react";
import tw from "twin.macro";

import { formatPercent } from "../../utils/format";
import { AddressLink } from "./AddressLink";
import { LoadingSpinner } from "./LoadingSpinner";
import { TokenAmountDisplay } from "./TokenAmountDisplay";

interface Props {
  className?: string;
  loading?: boolean;
  attributes: Record<string, unknown>;
}

export const AttributeList: React.FC<Props> = ({
  className,
  loading = true,
  attributes,
}: Props) => {
  return (
    <Wrapper className={className}>
      {Object.entries(attributes).map(([label, attribute]) => (
        <Row key={label}>
          <div>{label}</div>
          <Value>
            {attribute === undefined ? (
              loading ? (
                <LoadingSpinner />
              ) : (
                "(undefined)"
              )
            ) : attribute === null ? (
              "(null)"
            ) : attribute instanceof Date ? (
              attribute.getTime() === 0 ? (
                "never"
              ) : (
                attribute.toLocaleString()
              )
            ) : attribute instanceof PublicKey ? (
              <AddressLink address={attribute} showCopy />
            ) : typeof attribute === "object" &&
              "_bn" in (attribute as Record<string, unknown>) ? (
              <AddressLink
                address={new PublicKey((attribute as PublicKey).toString())}
                showCopy
              />
            ) : attribute instanceof TokenAmount ? (
              <TokenAmountDisplay showIcon amount={attribute} />
            ) : attribute instanceof Token ? (
              <AddressLink address={attribute.mintAccount} showCopy>
                {attribute.name}
              </AddressLink>
            ) : attribute instanceof Price ? (
              <>
                {attribute.asFraction.toFixed(3)}{" "}
                {attribute.quoteCurrency.symbol} /{" "}
                {attribute.baseCurrency.symbol}
              </>
            ) : attribute instanceof Percent ||
              (typeof attribute === "object" &&
                (attribute as Record<string, unknown>)?.isPercent) ? (
              formatPercent(attribute as Percent)
            ) : typeof attribute === "string" ? (
              attribute
            ) : typeof attribute === "number" ? (
              attribute.toLocaleString()
            ) : typeof attribute === "boolean" ? (
              attribute.toLocaleString()
            ) : BN.isBN(attribute) ? (
              attribute.toString()
            ) : (
              "unknown"
              // (attribute as React.ReactNode)
            )}
          </Value>
        </Row>
      ))}
    </Wrapper>
  );
};

const Value = styled.div`
  ${tw`font-mono text-DEFAULT`}
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;
