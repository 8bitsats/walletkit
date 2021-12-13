import "@reach/slider/styles.css";

import { SliderInput as ReachSlider } from "@reach/slider";
import tw, { css, styled } from "twin.macro";

const styledSlider = styled(ReachSlider);

export const InputSlider = styledSlider(
  () => css`
    background: none;

    [data-reach-slider-range] {
      background: none;
    }

    [data-reach-slider-track] {
      ${tw`bg-gray-800 rounded h-1 bg-gradient-to-r from-gray-600 to-gray-200`}
    }

    [data-reach-slider-handle] {
      ${tw`bg-gray-800`}

      width: 24px;
      height: 24px;
      border-radius: 12px;

      -webkit-appearance: none;
      appearance: none;
      cursor: pointer;
      box-shadow: 0px 6px 12px 8px rgba(0, 0, 0, 0.3);
    }
  `
);
