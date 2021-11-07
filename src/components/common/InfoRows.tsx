import "twin.macro";

import React from "react";

interface Props {
  rows: Record<string, React.ReactNode>;
}

export const InfoRows: React.FC<Props> = ({ rows }: Props) => {
  return (
    <div tw="grid gap-3">
      {Object.entries(rows).map(([label, value]) => (
        <div key={label} tw="text-xs flex items-start justify-between">
          <div tw="lowercase text-secondary">{label}</div>
          <div tw="text-DEFAULT">{value}</div>
        </div>
      ))}
    </div>
  );
};
