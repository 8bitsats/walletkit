import { Route, Switch } from "react-router-dom";

import { GovernanceDetailsView } from "./GovernanceDetailsView";
import { GovernanceOverviewView } from "./GovernanceOverviewView";
import { LockerIndexView } from "./locker/LockerIndexView";
import { ProgramsView } from "./ProgramsView";
import { ProposalCreateView } from "./proposals/ProposalCreateView";
import { ProposalIndexView } from "./proposals/ProposalIndexView";
import { ProposalsListView } from "./proposals/ProposalsListView";

export const GovernanceRoutes: React.FC = () => {
  return (
    <Switch>
      <Route component={GovernanceDetailsView} path="/gov/:governor/details" />
      <Route
        component={LockerIndexView}
        path="/gov/:governor/locker/:lockerSubpage"
      />
      <Route component={LockerIndexView} path="/gov/:governor/locker" />
      <Route
        component={ProposalCreateView}
        path="/gov/:governor/proposals/create"
      />
      <Route
        component={ProposalIndexView}
        path="/gov/:governor/proposals/:proposalIndex"
      />
      <Route component={ProgramsView} path="/gov/:governor/programs" />
      <Route component={ProposalsListView} path="/gov/:governor/proposals" />
      <Route component={GovernanceOverviewView} />
    </Switch>
  );
};
