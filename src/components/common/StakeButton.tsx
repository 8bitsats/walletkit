import { css } from "@emotion/react";
import styled from "@emotion/styled";
import tw from "twin.macro";

export const StakeButton = styled.button(() => [
  tw`py-1 rounded-xl text-2xl font-medium transform active:scale-95 bg-green-500 bg-opacity-10 text-green-500 hover:bg-opacity-20 transition-all duration-200`,
  css`
    width: 48px;
  `,
]);
