import { Global } from "@emotion/react";
import tw, { css } from "twin.macro";

import { Header } from "./Header";

interface Props {
  children?: React.ReactNode;
}

export const GovernorLayout: React.FC = ({ children }: Props) => {
  return (
    <div>
      <Header />
      <Global
        styles={css`
          body {
            &.dark {
              ${tw`bg-warmGray-800`}
            }
          }
        `}
      />
      <div tw="flex w-screen">
        <div tw="flex-grow h-full overflow-y-scroll">{children}</div>
      </div>
    </div>
  );
};
