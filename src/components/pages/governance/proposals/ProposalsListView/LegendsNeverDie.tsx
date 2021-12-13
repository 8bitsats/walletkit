import tw, { styled } from "twin.macro";

import { useGovernor } from "../../hooks/useGovernor";

export const LegendsNeverDie: React.FC = () => {
  const { proposalCount } = useGovernor();
  return (
    <div tw="bg-warmGray-800 p-5 flex gap-11 rounded">
      <div tw="text-2xl text-white font-medium bg-coolGray-800 rounded-full h-20 w-20 flex items-center justify-center">
        {proposalCount?.toLocaleString()}
      </div>
      <legend tw="flex flex-col gap-1 text-sm justify-center font-bold tracking-tight">
        <LegendItem>Active</LegendItem>
        <LegendItem>Passed</LegendItem>
        <LegendItem>Failed</LegendItem>
      </legend>
    </div>
  );
};

const LegendItem = styled.label(({ children }: { children: string }) => [
  tw`before:(mr-2.5 w-1 h-3.5 inline-block vertical-align[-25%] leading-none)`,
  children === "Active" && tw`before:bg-accent`,
  children === "Passed" && tw`before:bg-primary`,
  children === "Failed" && tw`before:bg-warmGray-600`,
]);
