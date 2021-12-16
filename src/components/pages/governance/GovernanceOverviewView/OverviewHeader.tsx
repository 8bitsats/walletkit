import { MINT_PARSER, useParsedAccountData } from "@saberhq/sail";
import { TokenAmount } from "@saberhq/token-utils";
import tw, { styled } from "twin.macro";

import { useGovernor } from "../hooks/useGovernor";

export const OverviewHeader: React.FC = () => {
  const { govToken, lockedSupply } = useGovernor();

  const { data: govTokenData } = useParsedAccountData(
    govToken?.mintAccount,
    MINT_PARSER
  );
  const totalSupplyFmt =
    govTokenData && govToken
      ? new TokenAmount(govToken, govTokenData.accountInfo.data.supply).format({
          numberFormatOptions: {
            maximumFractionDigits: 0,
          },
        })
      : govTokenData;
  const lockedSupplyFmt = lockedSupply
    ? lockedSupply.format({
        numberFormatOptions: {
          maximumFractionDigits: 0,
        },
      })
    : lockedSupply;

  return (
    <div tw="flex flex-wrap gap-2.5">
      <StatCard tw="flex-grow flex-basis[100%] md:flex-basis[auto]">
        <StatInner>
          <div tw="h-7 flex items-center">
            {lockedSupplyFmt ? (
              <span tw="text-white text-xl font-semibold">
                {lockedSupplyFmt}
              </span>
            ) : (
              <div tw="flex animate-pulse bg-gray h-4 w-12 rounded" />
            )}
          </div>
          <span tw="text-xs font-semibold text-coolGray-300 tracking-tighter">
            {govToken?.symbol} Locked
          </span>
        </StatInner>
      </StatCard>
      <StatCard tw="flex-grow md:(flex-basis[200px] flex-grow-0)">
        <StatInner>
          <div tw="h-7 flex items-center">
            {totalSupplyFmt ? (
              <span tw="text-white text-xl font-semibold">
                {totalSupplyFmt}
              </span>
            ) : (
              <div tw="flex animate-pulse bg-gray h-4 w-12 rounded" />
            )}
          </div>
          <span tw="text-xs font-semibold text-coolGray-300 tracking-tighter">
            Total Supply of {govToken?.symbol}
          </span>
        </StatInner>
      </StatCard>
      <StatCard tw="flex-grow md:(flex-basis[200px] flex-grow-0)">
        <StatInner>
          <span tw="text-white text-xl font-semibold">0</span>
          <span tw="text-xs font-semibold text-coolGray-300 tracking-tighter">
            Voting Addresses
          </span>
        </StatInner>
      </StatCard>
    </div>
  );
};

const StatCard = styled.div`
  ${tw`bg-coolGray-800 p-5 rounded`}
`;

const StatInner = styled.div`
  ${tw`flex flex-col`}
`;
