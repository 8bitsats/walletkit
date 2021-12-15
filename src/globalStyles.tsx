import { css, Global } from "@emotion/react";
import React from "react";
import tw, { GlobalStyles as BaseStyles } from "twin.macro";

export const globalStyles = (
  <>
    <BaseStyles />
    <Global
      styles={css`
        * {
          ${tw`antialiased`}
        }
        [data-reach-dialog-overlay] {
          z-index: 999 !important;
        }
        html,
        body {
          ${tw`h-full min-h-screen font-sans bg-white text-DEFAULT dark:(bg-warmGray-800 text-gray-300)`};
        }
      `}
    />
  </>
);
