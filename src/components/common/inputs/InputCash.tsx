import styled from "@emotion/styled";
import React, { useRef } from "react";
import tw from "twin.macro";

interface Props
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

export const InputCash: React.FC<Props> = ({
  onChange,
  integerOnly,
  ...rest
}: Props) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  return (
    <div tw="w-full">
      <div tw="flex items-center justify-center box-pack[center]">
        <div
          tw="flex items-center box-align[baseline] mx-auto"
          ref={wrapperRef}
        >
          <StyledInput
            {...rest}
            tw="caret-brand"
            minLength={1}
            inputMode="decimal"
            autoComplete="off"
            autoCorrect="off"
            type="text"
            placeholder="0"
            spellCheck="false"
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
        </div>
      </div>
    </div>
  );
};

const StyledInput = styled.input(() => [
  tw`flex-shrink p-4 bg-skin-100 rounded outline-none w-full h-full border-none appearance-none focus:(border-none! outline-none!)`,
  tw`font-medium text-2xl disabled:(cursor-not-allowed)`,
  tw`placeholder:(text-gray-200)`,
]);
