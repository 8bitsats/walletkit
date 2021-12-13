import { Percent, Price, Token, TokenAmount } from "@saberhq/token-utils";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { startCase } from "lodash";
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
    <div tw="flex flex-col text-sm" className={className}>
      {Object.entries(attributes).map(([label, attribute], i) => (
        <div
          tw="flex justify-between items-center px-6 py-2 gap-4"
          css={[i !== 0 && tw`border-t dark:border-warmGray-800`]}
          key={label}
        >
          <div tw="text-secondary dark:text-gray-400 font-semibold">
            {startCase(label)}
          </div>
          <div tw="font-medium">
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
          </div>
        </div>
      ))}
    </div>
  );
};
