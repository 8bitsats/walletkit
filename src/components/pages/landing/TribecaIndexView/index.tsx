import { Global } from "@emotion/react";
import { useEffect } from "react";
import tw, { css } from "twin.macro";

import { Jumbotron } from "./Jumbotron";

export const TribecaIndexView: React.FC = () => {
  useEffect(() => {
    document.body.classList.add("dark");
    return () => {
      document.body.classList.remove("dark");
    };
  }, []);

  return (
    <div tw="w-full overflow-x-hidden">
      <Global
        styles={css`
          body {
            &.dark {
              ${tw`bg-warmGray-900`}
            }
          }
        `}
      />
      <Jumbotron />
    </div>
  );
};
