import React from "react";
import tw, { css } from "twin.macro";

interface Props {
  head?: React.ReactNode;
  children: React.ReactNode;
}

export const TableCardBody: React.FC<Props> = ({ head, children }: Props) => {
  return (
    <div tw="mb-0 w-full">
      <table
        tw="whitespace-nowrap w-full text-sm"
        css={css`
          th:first-child,
          td:first-child {
            ${tw`pl-6 text-white`}
          }
          th:last-child,
          td:last-child {
            ${tw`pr-6`}
          }
        `}
      >
        {head && (
          <thead
            css={css`
              th {
                ${tw`text-left align-middle p-4`}
                ${tw`text-white font-semibold`}
              }
            `}
          >
            {head}
          </thead>
        )}
        <tbody
          css={css`
            td {
              ${tw`align-middle p-4 border-t border-t-warmGray-800`}
            }
            tr:first-child {
              th,
              td {
                ${!head && tw`border-none`}
              }
            }
          `}
        >
          {children}
        </tbody>
      </table>
    </div>
  );
};
