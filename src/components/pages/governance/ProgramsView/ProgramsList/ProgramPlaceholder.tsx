import React from "react";

import { ContentLoader } from "../../../../common/ContentLoader";

export const ProgramPlaceholder: React.FC = () => {
  return (
    <div tw="flex items-center justify-between py-5 px-6 border-l-2 border-l-transparent border-b border-b-warmGray-800 cursor-pointer hover:border-l-primary">
      <div>
        <div tw="h-5 flex items-center">
          <ContentLoader tw="h-3 rounded" />
        </div>
        <PlaceholderSubtitle />
      </div>
    </div>
  );
};

export const PlaceholderSubtitle: React.FC = () => (
  <div tw="flex items-center gap-2 mt-2">
    <div tw="flex items-center gap-1">
      <ContentLoader tw="h-2 w-4" />
      <span>&middot;</span>
      <ContentLoader tw="h-2 w-20" />
    </div>
  </div>
);
