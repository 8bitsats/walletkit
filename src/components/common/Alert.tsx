import styled from "@emotion/styled";
import React from "react";
import { FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import tw, { theme } from "twin.macro";

interface Props {
  className?: string;
  children?: React.ReactNode;
  type?: "warning" | "danger" | "info";
}

export const Alert: React.FC<Props> = ({
  className,
  children,
  type = "warning",
}: Props) => {
  return (
    <Wrapper className={className} type={type}>
      {type === "info" && <FaInfoCircle />}
      {type === "warning" && <FaExclamationTriangle tw="mt-1" />}
      <div>{children}</div>
    </Wrapper>
  );
};

const COLORS = {
  warning: "#ffdc00",
  danger: "#ff0033",
  info: theme`colors.blue.400`,
};

const Wrapper = styled.div<{ type: "warning" | "danger" | "info" }>`
  ${tw`bg-warmGray-800 rounded border-t-4 text-gray-300`}
  border-top-color: ${({ type }) => COLORS[type]};
  & > svg {
    color: ${({ type }) => COLORS[type]};
    ${tw`h-6 w-6`}
  }
  ${tw`grid gap-6 p-6`}
  grid-template-columns: 24px 1fr;
  h2 {
    ${tw`text-base leading-normal mb-2 font-semibold text-white`}
  }
`;
