import { useGovernor } from "../../pages/governance/hooks/useGovernor";
import { TokenIcon } from "../TokenIcon";

interface Props {
  title: React.ReactNode;
  header?: React.ReactNode;
  right?: React.ReactNode;
  preContent?: React.ReactNode;
  children?: React.ReactNode;
  contentStyles?: React.CSSProperties;
  hideDAOName?: boolean;
}

export const GovernancePage: React.FC<Props> = ({
  title,
  header,
  right,
  preContent,
  children,
  contentStyles,
  hideDAOName = false,
}: Props) => {
  const { govToken, daoName } = useGovernor();
  return (
    <div tw="w-full">
      <div tw="bg-warmGray-900 pb-24">
        <div tw="h-6 mx-auto w-11/12 max-w-7xl">
          {!hideDAOName && (
            <div tw="flex items-center gap-2 text-sm font-semibold text-white">
              <TokenIcon token={govToken} size={24} />
              <span>{daoName} Governance</span>
            </div>
          )}
        </div>
        <div tw="max-w-5xl w-11/12 mx-auto">
          <div tw="flex gap-8 flex-row flex-wrap items-center justify-between w-full mt-16">
            <div tw="flex flex-col">
              <h1 tw="text-2xl md:text-3xl font-bold text-white tracking-tighter">
                {title}
              </h1>
              {header}
            </div>
            <div>{right}</div>
          </div>
          {preContent && <div tw="mt-8">{preContent}</div>}
        </div>
      </div>
      <main tw="w-full -mt-16 mb-20" style={contentStyles}>
        <div tw="max-w-5xl w-11/12 mx-auto">{children}</div>
      </main>
    </div>
  );
};
