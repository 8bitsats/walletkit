import React from "react";

import { LoadingSpinner } from "./LoadingSpinner";

interface Props {
  className?: string;
}

export const LoadingPage: React.FC<Props> = ({ className }: Props) => {
  return (
    <div tw="flex items-center justify-center" className={className}>
      <LoadingSpinner tw="h-[84px] w-[84px]" />
    </div>
  );
};
