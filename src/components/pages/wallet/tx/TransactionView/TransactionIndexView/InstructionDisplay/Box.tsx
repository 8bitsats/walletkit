interface Props {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const Box: React.FC<Props> = ({ title, children, className }: Props) => (
  <div tw="border dark:border-warmGray-600 rounded text-sm">
    <h2 tw="px-6 py-2 font-semibold text-gray-800 dark:text-gray-100">
      {title}
    </h2>
    <div
      tw="px-6 py-2 border-t border-t-gray-150 dark:border-t-warmGray-600"
      className={className}
    >
      {children}
    </div>
  </div>
);
