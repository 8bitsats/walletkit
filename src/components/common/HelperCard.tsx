interface Props {
  children?: React.ReactNode;
}

export const HelperCard: React.FC<Props> = ({ children }: Props) => {
  return (
    <div tw="p-4 rounded border border-primary bg-primary bg-opacity-20 text-primary-100 text-sm">
      {children}
    </div>
  );
};
