import { isPublicKey } from "@saberhq/solana-contrib";
import { Percent, Price, Token, TokenAmount } from "@saberhq/token-utils";
import { PublicKey } from "@solana/web3.js";
import BN, { isBN } from "bn.js";
import { startCase } from "lodash";
import React from "react";

import { formatPercent } from "../../utils/format";
import { fmtObject } from "../pages/anchor/InspectorPage/SimulationSection/AccountDiff/makeDiff";
import { AddressLink } from "./AddressLink";
import { TableCardBody } from "./card/TableCardBody";
import { LoadingSpinner } from "./LoadingSpinner";
import { AddressWithContext } from "./program/AddressWithContext";
import { TokenAmountDisplay } from "./TokenAmountDisplay";

interface Props {
  className?: string;
  loading?: boolean;
  value: unknown;
  valueStyles?: React.CSSProperties;
}

export const DisplayValue: React.FC<Props> = ({
  className,
  loading = true,
  value,
}: Props) => {
  return (
    <div className={className}>
      {value === undefined ? (
        loading ? (
          <LoadingSpinner />
        ) : (
          "(undefined)"
        )
      ) : value === null ? (
        "(null)"
      ) : value instanceof Date ? (
        value.getTime() === 0 ? (
          "never"
        ) : (
          value.toLocaleString()
        )
      ) : isBN(value) ? (
        value.bitLength() > 53 ? (
          value.toString()
        ) : (
          value.toNumber().toLocaleString()
        )
      ) : isPublicKey(value) ? (
        <AddressWithContext pubkey={new PublicKey(value)} />
      ) : value instanceof TokenAmount ? (
        <TokenAmountDisplay showIcon amount={value} />
      ) : value instanceof Token ? (
        <AddressLink address={value.mintAccount} showCopy>
          {value.name}
        </AddressLink>
      ) : value instanceof Price ? (
        <>
          {value.asFraction.toFixed(3)} {value.quoteCurrency.symbol} /{" "}
          {value.baseCurrency.symbol}
        </>
      ) : value instanceof Percent ||
        (typeof value === "object" &&
          (value as Record<string, unknown>)?.isPercent) ? (
        formatPercent(value as Percent)
      ) : typeof value === "string" ? (
        value
      ) : typeof value === "number" ? (
        value.toLocaleString()
      ) : typeof value === "boolean" ? (
        value.toLocaleString()
      ) : BN.isBN(value) ? (
        value.toString()
      ) : // eslint-disable-next-line @typescript-eslint/ban-types
      React.isValidElement(value as {} | null | undefined) ? (
        (value as React.ReactNode)
      ) : Array.isArray(value) ? (
        <div tw="flex flex-col gap-1">
          {value.map((v: unknown, i) => (
            <DisplayValue key={i} value={v} />
          ))}
        </div>
      ) : typeof value === "object" ? (
        <TableCardBody>
          {Object.entries(value).map(([k, v]) => {
            return (
              <tr key={k}>
                <td>{startCase(k)}</td>
                <td>
                  <div tw="flex flex-col items-end">
                    <DisplayValue value={v as unknown} />
                  </div>
                </td>
              </tr>
            );
          })}
        </TableCardBody>
      ) : (
        <pre>
          <code>{fmtObject(value as Record<string, unknown>)}</code>
        </pre>
      )}
    </div>
  );
};
