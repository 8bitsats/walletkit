import { FaTimes } from "react-icons/fa";

import { Button } from "../Button";
import { useModal } from "./context";

interface Props {
  title: string;
  children?: React.ReactNode;
  buttonProps?: React.ComponentProps<typeof Button>;
}

export const ModalInner: React.FC<Props> = ({
  title,
  children,
  buttonProps,
}: Props) => {
  const { close } = useModal();
  return (
    <>
      <div tw="relative border-b border-b-warmGray-800 text-white font-bold text-base text-center py-4">
        {title}
        <button
          onClick={() => close()}
          tw="absolute right-4 h-full flex items-center top-0 text-warmGray-600 hover:text-warmGray-200 transition-colors"
        >
          <FaTimes />
        </button>
      </div>
      <div tw="p-8">
        {children}
        {buttonProps && <Button tw="mt-8 w-full h-10" {...buttonProps} />}
      </div>
    </>
  );
};
