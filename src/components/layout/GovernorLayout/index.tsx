import { Header } from "./Header";

interface Props {
  children?: React.ReactNode;
}

export const GovernorLayout: React.FC = ({ children }: Props) => {
  return (
    <div>
      <Header />
      <div tw="flex w-screen">
        <div tw="flex-grow h-screen overflow-y-scroll">{children}</div>
      </div>
    </div>
  );
};
