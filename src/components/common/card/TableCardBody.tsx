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
            td:first-child {
              ${tw`pl-6 text-white font-semibold`}
            }
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
