import { usePubkey } from "@saberhq/sail";
import type { InstructionLogEntry } from "@saberhq/solana-contrib";

import { useProgramMeta } from "../../../../../hooks/useProgramMeta";
import { programLabel } from "../../../../../utils/programs";
import { styleColor } from "../../../../pages/anchor/InspectorPage/programLogsV2";
import { prefixBuilder } from ".";

interface Props {
  entry: InstructionLogEntry & { type: "cpi" };
}

export const RenderedCPI: React.FC<Props> = ({ entry }: Props) => {
  const programId = usePubkey(entry.programAddress);
  const { data: meta } = useProgramMeta(programId);

  const label =
    (meta?.meta?.label
      ? `${meta?.meta?.label} (${meta.programID.toString()})`
      : null) ??
    (programId
      ? programLabel(programId.toString()) ??
        `Unknown (${programId.toString()}) Program`
      : "Unknown Program");

  return (
    <span>
      <span>{prefixBuilder(entry.depth)}</span>
      <span style={{ color: styleColor(entry.type) }}>Invoking {label}</span>
    </span>
  );
};
