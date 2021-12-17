import { useState } from "react";

import { AsyncButton } from "./AsyncButton";
import { Modal } from "./Modal";

type Props = React.ComponentProps<typeof AsyncButton> & {
  modal: {
    title: string;
    contents: React.ReactNode;
  };
};

export const AsyncConfirmButton: React.FC<Props> = ({
  children,
  onClick,
  modal: { title, contents },
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
      >
        <div tw="border-b border-b-warmGray-800 text-white font-bold text-base text-center py-4">
          {title}
        </div>
        <div tw="p-8">
          {contents}
          <AsyncButton tw="mt-8 w-full" {...buttonProps} onClick={onClick}>
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
