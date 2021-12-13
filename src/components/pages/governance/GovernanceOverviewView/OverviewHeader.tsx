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
    <div tw="flex gap-2.5">
      <StatCard tw="flex-grow">
        <StatInner>
          <span tw="text-white text-xl font-semibold">{lockedSupplyFmt}</span>
          <span tw="text-xs font-semibold text-coolGray-300 tracking-tighter">
            {govToken?.symbol} Locked
          </span>
        </StatInner>
      </StatCard>
      <StatCard tw="flex-basis[200px]">
        <StatInner>
          <span tw="text-white text-xl font-semibold">{totalSupplyFmt}</span>
          <span tw="text-xs font-semibold text-coolGray-300 tracking-tighter">
            Total Supply of {govToken?.symbol}
          </span>
        </StatInner>
      </StatCard>
      <StatCard tw="flex-basis[200px]">
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
