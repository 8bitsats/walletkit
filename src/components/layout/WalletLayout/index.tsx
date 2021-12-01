import { Sidebar } from "./Sidebar";

interface Props {
  children?: React.ReactNode;
}

export const WalletLayout: React.FC = ({ children }: Props) => {
  return (
    <div tw="flex w-screen">
      <Sidebar />
      <div tw="flex-grow h-screen overflow-y-scroll">{children}</div>
    </div>
  );
};
