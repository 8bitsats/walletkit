import type { InstructionLogEntry, PublicKey } from "@saberhq/solana-contrib";

import { styleColor } from "../../../../pages/anchor/InspectorPage/programLogsV2";
import { RenderedCPI } from "./RenderedCPI";
import { RenderedProgramError } from "./RenderedProgramError";

export const prefixBuilder = (depth: number) => {
  const prefix = new Array(depth - 1).fill("\u00A0\u00A0").join("");
  return prefix + "> ";
};

const fmtLogEntry = (entry: InstructionLogEntry) => {
  switch (entry.type) {
    case "success":
      return `Program returned success`;
    case "programError":
      return `Program returned error: ${entry.text}`;
    case "runtimeError":
      return `Runtime error: ${entry.text}`;
    case "system":
      return entry.text;
    case "text":
      return entry.text;
    case "cpi":
      return `Invoking Unknown ${
        entry.programAddress ? `(${entry.programAddress}) ` : ""
      }Program`;
  }
};

interface Props {
  entry: InstructionLogEntry;
  currentProgramId?: PublicKey;
}

export const RenderedLogEntry: React.FC<Props> = ({
  entry,
  currentProgramId,
}: Props) => {
  if (entry.type === "cpi") {
    return <RenderedCPI entry={entry} />;
  }
  if (entry.type === "programError") {
    return (
      <RenderedProgramError entry={entry} currentProgramId={currentProgramId} />
    );
  }
  return (
    <span>
      <span>{prefixBuilder(entry.depth)}</span>
      <span style={{ color: styleColor(entry.type) }}>
        {fmtLogEntry(entry)}
      </span>
    </span>
  );
};
