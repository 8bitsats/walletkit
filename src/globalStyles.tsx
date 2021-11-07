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
        body {
          ${tw`bg-skin-200 font-display`};
        }
        [data-reach-dialog-overlay] {
          z-index: 999 !important;
        }
      `}
    />
  </>
);
