import tw, { css } from "twin.macro";

interface Props {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  children?: React.ReactNode;
}

export const Notice: React.FC<Props> = ({
  className,
  icon,
  title,
  children,
}: Props) => {
  return (
    <div tw=" border px-5 py-4 flex flex-col gap-3" className={className}>
      {title && (
        <div tw="flex items-center gap-3">
          {icon && (
            <div
              tw="text-secondary"
              css={css`
                & > img,
                & > svg {
                  ${tw`w-[18px] h-[18px]`}
                }
              `}
            >
              {icon}
            </div>
          )}
          <h2 tw="font-medium text-sm">{title}</h2>
        </div>
      )}
      <div tw="prose prose-sm">{children}</div>
    </div>
  );
};
