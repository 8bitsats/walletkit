import styled from "@emotion/styled";
import React from "react";
import tw from "twin.macro";

interface IProps
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "onChange"
  > {
  onChange?: (val: string) => void;
  integerOnly?: boolean;
}

const DIGIT_ONLY = /^(\d)*$/;
const DECIMAL_ONLY = /^-?\d*(\.\d*)?$/;

export const InputDecimal: React.FC<IProps> = ({
  onChange,
  integerOnly,
  ...rest
}: IProps) => (
  <StyledInput
    {...rest}
    onChange={(e) => {
      const { value } = e.target;
      if (integerOnly) {
        if (
          value === "" ||
          (DIGIT_ONLY.test(value) && !Number.isNaN(parseInt(value)))
        ) {
          onChange?.(value);
        }
        return;
      }
      if (
        (!Number.isNaN(value) && DECIMAL_ONLY.test(value)) ||
        value === "" ||
        value === "-"
      ) {
        onChange?.(value);
      }
    }}
  />
);

const StyledInput = styled.input<{ hasBackground?: boolean }>`
  ${tw`font-mono text-2xl outline-none border rounded px-4 py-2`}
  &:disabled {
    ${tw`text-gray-300`}
  }
  &::placeholder {
    ${tw`text-secondary`}
  }
`;
