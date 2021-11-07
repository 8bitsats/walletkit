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
          ${tw`font-sans bg-skin-200`};
        }
        [data-reach-dialog-overlay] {
          z-index: 999 !important;
        }
      `}
    />
  </>
);
