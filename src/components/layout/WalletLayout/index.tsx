import toast, { resolveValue, Toaster } from "react-hot-toast";
import { VscClose } from "react-icons/vsc";

import { Sidebar } from "./Sidebar";

interface Props {
  children?: React.ReactNode;
}

export const WalletLayout: React.FC = ({ children }: Props) => {
  return (
    <div tw="flex w-screen">
      <Sidebar />
      <div tw="flex-grow h-screen overflow-y-scroll">{children}</div>
      <Toaster position="bottom-right">
        {(t) => (
          <div
            tw="bg-white border p-4 w-full max-w-sm shadow rounded relative"
            style={{
              opacity: t.visible ? 1 : 0,
            }}
          >
            <button
              tw="absolute right-3 top-3 text-secondary hover:text-gray-600"
              onClick={() => toast.dismiss(t.id)}
            >
              <VscClose />
            </button>
            {resolveValue(t.message, t)}
          </div>
        )}
      </Toaster>
    </div>
  );
};
