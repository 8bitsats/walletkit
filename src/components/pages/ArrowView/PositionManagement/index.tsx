import type { ArrowData } from "@arrowprotocol/arrow";
import { Redirect, Route, Switch } from "react-router-dom";

import { Module } from "../../../common/Module";
import { NavTabs } from "../../../common/NavTabs";
import { StakeForm } from "./StakeForm";
import { UnstakeForm } from "./UnstakeForm";

interface Props {
  arrowData: ArrowData;
}

export const PositionManagement: React.FC<Props> = ({ arrowData }: Props) => {
  return (
    <Module tw="grid gap-6 w-full md:w-[378px] p-6">
      <NavTabs
        options={[
          {
            label: "Stake",
            path: `/arrow/${arrowData.mint.toString()}/stake`,
          },
          {
            label: "Unstake",
            path: `/arrow/${arrowData.mint.toString()}/unstake`,
          },
        ]}
      />
      <Switch>
        <Route path="/arrow/:arrowMint/stake">
          <StakeForm arrowData={arrowData} />
        </Route>
        <Route path="/arrow/:arrowMint/unstake">
          <UnstakeForm arrowData={arrowData} />
        </Route>
        <Redirect path="/" to={`/arrow/${arrowData.mint.toString()}/stake`} />
      </Switch>
    </Module>
  );
};
