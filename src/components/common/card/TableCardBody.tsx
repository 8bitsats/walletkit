import React from "react";
import tw, { css } from "twin.macro";

interface Props {
  children: React.ReactNode;
}

export const TableCardBody: React.FC<Props> = ({ children }: Props) => {
  return (
    <div tw="mb-0 w-full">
      <table tw="whitespace-nowrap w-full text-sm">
        <tbody
          css={css`
            td {
              ${tw`align-middle p-4 border-t border-t-warmGray-800`}
            }
            th {
              ${tw`text-left align-middle p-4 border-t border-t-warmGray-800`}
              ${tw`text-white font-semibold`}
            }
            tr:first-child {
              th,
              td {
                ${tw`border-none`}
              }
            }
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
          {children}
        </tbody>
      </table>
    </div>
  );
};
