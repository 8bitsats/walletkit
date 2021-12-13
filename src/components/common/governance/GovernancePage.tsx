interface Props {
  title: string;
  header?: React.ReactNode;
  right?: React.ReactNode;
  preContent?: React.ReactNode;
  children?: React.ReactNode;
}

export const GovernancePage: React.FC<Props> = ({
  title,
  header,
  right,
  preContent,
  children,
}: Props) => {
  return (
    <div tw="w-full">
      <div tw="bg-warmGray-900 pt-20 pb-24">
        <div tw="max-w-5xl w-11/12 mx-auto">
          <div tw="flex items-center justify-between w-full">
            <div tw="flex flex-col">
              <h1 tw="text-3xl font-bold text-white tracking-tighter">
                {title}
              </h1>
              {header}
            </div>
            <div>{right}</div>
          </div>
          {preContent && <div tw="mt-8">{preContent}</div>}
        </div>
      </div>
      <div tw="w-full -mt-16 mb-20">
        <div tw="max-w-5xl w-11/12 mx-auto">{children}</div>
      </div>
    </div>
  );
};
