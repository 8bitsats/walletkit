interface Props {
  children?: React.ReactNode;
}

export const HelperCard: React.FC<Props> = ({ children }: Props) => {
  return (
    <div tw="px-4 py-2 rounded border border-primary bg-primary bg-opacity-20 text-primary-100 text-sm">
      {children}
    </div>
  );
};
