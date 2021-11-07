import styled from "@emotion/styled";
import React, { useState } from "react";
import tw from "twin.macro";

import { handleException } from "../../utils/error";
import { LoadingSpinner } from "./LoadingSpinner";

type Variant =
  | "outline"
  | "default"
  | "danger"
  | "primary"
  | "secondary"
  | "notice"
  | "cool"
  | "muted"
  | "gray"
  | "primary-inverse";

type Size = "sm" | "small" | "md" | undefined;

interface AdditionalButtonProps {
  size?: Size;
  variant?: Variant;
  icon?: boolean;
}

export interface ButtonProps
  extends React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    AdditionalButtonProps {
  onClick?:
    | ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>);
  children?: React.ReactNode;
}

/**
 * A button.
 * @returns
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  className,
  onClick,
  ...props
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <StyledButton
      {...props}
      onClick={
        onClick
          ? async (e) => {
              setLoading(true);
              try {
                await onClick(e);
              } catch (e) {
                handleException(e, {
                  source: "button",
                });
              }
              setLoading(false);
            }
          : undefined
      }
      disabled={disabled || loading}
      className={className}
      style={{
        ...props.style,
      }}
    >
      {loading ? (
        <div tw="flex items-center gap-2">
          {children}
          <LoadingSpinner tw="ml-2 mb-0.5" />
        </div>
      ) : (
        children
      )}
    </StyledButton>
  );
};

export const StyledButton = styled.button<AdditionalButtonProps>(
  ({ size = "sm", variant = "primary", icon }) => [
    tw`flex flex-row items-center justify-center  leading-normal`,
    tw`rounded-2xl`,
    tw`text-sm font-semibold`,
    tw`transform active:scale-98 text-DEFAULT hover:bg-opacity-90`,
    tw`transition-transform`,

    variant === "outline" && tw`border border-skin-700 hover:border-brand`,
    variant === "primary" && tw`text-white bg-brand shadow`,
    variant === "muted" && tw`text-skin-200 bg-skin-700 hover:bg-skin-500`,

    variant === "danger" && tw`bg-red-500 text-black font-bold`,

    tw`disabled:(bg-gray-400 text-gray-600 cursor-not-allowed)`,

    size === "sm" && tw`py-1.5 px-2 text-base`,
    size === "md" && tw`py-3 px-5 text-base`,

    icon && tw`rounded-full w-7 h-7 p-0!`,
  ]
);
