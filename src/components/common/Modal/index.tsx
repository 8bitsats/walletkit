import "@reach/dialog/styles.css";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { DialogContent, DialogOverlay } from "@reach/dialog";
import { animated, useSpring, useTransition } from "@react-spring/web";
import React from "react";
import { isMobile } from "react-device-detect";
import { useGesture } from "react-use-gesture";
import tw from "twin.macro";

export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onDismiss: () => void;
  darkenOverlay?: boolean;
  topMargin?: number;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  isOpen,
  onDismiss,
  darkenOverlay = true,
  topMargin,
}: ModalProps) => {
  const fadeTransition = useTransition(isOpen, {
    config: { duration: 150 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const [{ y }, set] = useSpring(() => ({
    y: 0,
    config: { mass: 1, tension: 210, friction: 20 },
  }));
  const bind = useGesture({
    onDrag: (state) => {
      set({
        y: state.down ? state.movement[1] : 0,
      });
      if (
        state.movement[1] > 300 ||
        (state.velocity > 3 && state.direction[1] > 0)
      ) {
        onDismiss();
      }
    },
  });

  return (
    <>
      {fadeTransition(
        (props, item) =>
          item && (
            <StyledDialogOverlay
              style={props}
              isOpen={isOpen || props.opacity.get() !== 0}
              onDismiss={onDismiss}
              darkenOverlay={darkenOverlay}
            >
              <ModalWrapper
                topMargin={topMargin}
                aria-label="dialog content"
                {...(isMobile
                  ? {
                      ...bind(),
                      style: {
                        transform: y.to(
                          (n) => `translateY(${n > 0 ? n : 0}px)`
                        ),
                      },
                    }
                  : {})}
              >
                {children}
              </ModalWrapper>
            </StyledDialogOverlay>
          )
      )}
    </>
  );
};

const ModalWrapper = styled(animated(DialogContent), {
  shouldForwardProp: (prop) => prop !== "topMargin",
})<{ topMargin?: number }>`
  ${tw`shadow-2xl w-full max-w-lg p-6 rounded-lg relative`}
  ${({ topMargin }) =>
    topMargin !== undefined &&
    css`
      margin-top: ${topMargin}px;
    `}
`;

const StyledDialogOverlay = styled(animated(DialogOverlay), {
  shouldForwardProp: (prop) => prop !== "darkenOverlay",
})<{
  darkenOverlay: boolean;
}>`
  &[data-reach-dialog-overlay] {
    z-index: 11;
  }
  ${({ darkenOverlay }) =>
    darkenOverlay
      ? css`
          background: rgba(0, 0, 0, 0.55);
        `
      : css`
          background: none;
        `}
`;