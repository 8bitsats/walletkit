import type { Interpolation, Theme } from "@emotion/react";
import { useState } from "react";

import { AsyncButton } from "./AsyncButton";
import { Modal } from "./Modal";

type Props = React.ComponentProps<typeof AsyncButton> & {
  modal: {
    title: string;
    disabled?: boolean;
    contents: React.ReactNode;
    style?: Interpolation<Theme>;
  };
};

export const AsyncConfirmButton: React.FC<Props> = ({
  children,
  onClick,
  modal: { title, contents, disabled, style: modalStyle },
  ...buttonProps
}: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <>
      <Modal
        tw="p-0"
        isOpen={showModal}
        onDismiss={() => {
          setShowModal(false);
        }}
        css={modalStyle}
      >
        <div tw="border-b border-b-warmGray-800 text-white font-bold text-base text-center py-4">
          {title}
        </div>
        <div tw="p-8">
          {contents}
          <AsyncButton
            tw="mt-8 w-full"
            {...buttonProps}
            disabled={disabled}
            onClick={onClick}
          >
            {title}
          </AsyncButton>
        </div>
      </Modal>
      <AsyncButton
        {...buttonProps}
        onClick={() => {
          setShowModal(true);
        }}
      >
        {children}
      </AsyncButton>
    </>
  );
};
