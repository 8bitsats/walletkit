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
    <div tw="text-sm flex items-center justify-between py-5 px-6 border-l-2 border-l-transparent border-b border-b-warmGray-800">
      <div tw="flex flex-grow w-2/3">
        <div tw="flex-basis[236px] flex flex-col gap-1">
          <span tw="font-medium text-white">{label}</span>
          <div tw="text-xs flex gap-1 text-secondary">
            <span>ID:</span>
            <AddressLink address={program.programID} showCopy />
          </div>
        </div>
        <div tw="invisible lg:flex lg:ml-12 lg:visible items-center gap-1 text-secondary">
          <span>Deployed At:</span>
          <span>
            <SlotLink slot={program.lastDeploySlot} />
          </span>
        </div>
      </div>
      <div>{actions}</div>
    </div>
  );
};
