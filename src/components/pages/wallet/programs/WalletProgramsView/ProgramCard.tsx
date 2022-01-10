import type { ProgramInfo } from "../../../../../hooks/useAuthorityPrograms";
import { useProgramLabel } from "../../../../../hooks/useProgramMeta";
import { AddressLink } from "../../../../common/AddressLink";
import { SlotLink } from "../../../../common/SlotLink";

interface Props {
  program: ProgramInfo;
  actions?: React.ReactNode;
}

export const ProgramCard: React.FC<Props> = ({ program, actions }: Props) => {
  const label = useProgramLabel(program.programID);
  return (
    <div tw="flex items-center rounded bg-gray-50 border px-3 py-2 text-sm">
      <div tw="flex flex-grow">
        <div tw="flex-basis[236px] flex flex-col gap-1">
          <span tw="font-medium text-gray-800">{label}</span>
          <div tw="text-xs flex gap-1 text-secondary">
            <span>ID:</span>
            <AddressLink address={program.programID} showCopy />
          </div>
        </div>
        <div tw="invisible flex items-center gap-1 text-secondary">
          <span>Deployed at:</span>
          <span>
            <SlotLink slot={program.lastDeploySlot} />
          </span>
        </div>
      </div>
      <div>{actions}</div>
    </div>
  );
};
