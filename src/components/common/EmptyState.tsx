import tw, { css } from "twin.macro";

interface Props {
  icon?: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<Props> = ({
  icon,
  title,
  children,
  className,
}: Props) => {
  return (
    <div
      tw="w-full py-12 text-sm flex flex-col items-center"
      className={className}
    >
      {icon && (
        <div
          tw="w-20 h-20 mb-3"
          css={css`
            & > svg,
            & > img {
              ${tw`w-full h-full text-gray-300`}
            }
          `}
        >
          {icon}
        </div>
      )}
      <div tw="h-6">
        <span tw="text-secondary ">{title}</span>
      </div>
      <div>{children}</div>
    </div>
  );
};
