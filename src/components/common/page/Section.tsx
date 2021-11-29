interface Props {
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

export const BasicSection: React.FC<Props> = ({
  title,
  description,
  children,
}: Props) => {
  return (
    <div>
      <h2 tw="text-xl font-medium mb-1">{title}</h2>
      {description && <p tw="text-secondary text-sm">{description}</p>}
      {children}
    </div>
  );
};
