import { usePubkey } from "@saberhq/sail";

import { useProgramMeta } from "../../../../../hooks/useProgramMeta";
import { programLabel } from "../../../../../utils/programs";
import type { LogEntry } from "../../../../pages/anchor/InspectorPage/programLogsV2";
import { styleColor } from "../../../../pages/anchor/InspectorPage/programLogsV2";
import { prefixBuilder } from ".";

interface Props {
  entry: LogEntry & { type: "cpi" };
}

export const RenderedCPI: React.FC<Props> = ({ entry }: Props) => {
  const programId = usePubkey(entry.programAddress);
  const { data: meta } = useProgramMeta(programId);

  const label =
    meta?.meta?.label ??
    (programId
      ? programLabel(programId.toString()) ??
        `Unknown (${programId.toString()}) Program`
      : "Unknown Program");

  return (
    <span>
      <span>{prefixBuilder(entry.depth)}</span>
      <span style={{ color: styleColor(entry.style) }}>Invoking {label}</span>
    </span>
  );
};
