import type { LogEntry } from "../../../../pages/anchor/InspectorPage/programLogsV2";
import { styleColor } from "../../../../pages/anchor/InspectorPage/programLogsV2";
import { RenderedCPI } from "./RenderedCPI";

export const prefixBuilder = (depth: number) => {
  const prefix = new Array(depth - 1).fill("\u00A0\u00A0").join("");
  return prefix + "> ";
};

const fmtLogEntry = (entry: LogEntry) => {
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
  entry: LogEntry;
}

export const RenderedLogEntry: React.FC<Props> = ({ entry }: Props) => {
  if (entry.type === "cpi") {
    return <RenderedCPI entry={entry} />;
  }
  return (
    <span>
      <span>{prefixBuilder(entry.depth)}</span>
      <span style={{ color: styleColor(entry.style) }}>
        {fmtLogEntry(entry)}
      </span>
    </span>
  );
};
