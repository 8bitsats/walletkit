import { ProposalState } from "@tribecahq/tribeca-sdk";
import React from "react";

import { ProposalStateLabel } from "./ProposalStateLabel";

export const PlaceholderCard: React.FC = () => {
  return (
    <div tw="flex items-center justify-between py-5 px-6 border-l-2 border-l-transparent border-b border-b-warmGray-800 cursor-pointer hover:border-l-primary">
      <div tw="space-y-1">
        <div tw="flex items-center gap-2 mt-2">
          <ProposalStateLabel state={ProposalState.Draft} />
        </div>
      </div>
    </div>
  );
};
