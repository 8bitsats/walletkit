interface Props {
  title: string;
  children?: React.ReactNode;
}

export const Box: React.FC<Props> = ({ title, children }: Props) => (
  <div tw="border rounded text-sm">
    <h2 tw="px-6 py-2 font-semibold text-gray-800">{title}</h2>
    <div tw="px-6 py-2 border-t border-t-gray-150">{children}</div>
  </div>
);
